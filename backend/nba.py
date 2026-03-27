from nba_api.stats.endpoints import (
    leaguegamefinder,
    boxscoretraditionalv3,
    playbyplayv3,
    videoeventsasset,
)

_HEADERS = {
    "Host": "stats.nba.com",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0",
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate, br",
    "x-nba-stats-origin": "stats",
    "x-nba-stats-token": "true",
    "Connection": "keep-alive",
    "Referer": "https://www.nba.com/",
    "Origin": "https://www.nba.com",
}


def get_games(date: str) -> list[dict]:
    gf = leaguegamefinder.LeagueGameFinder(
        date_from_nullable=date,
        date_to_nullable=date,
        league_id_nullable="00",
        headers=_HEADERS,
    )
    df = gf.league_game_finder_results.get_data_frame()
    seen: set[str] = set()
    results = []
    for _, row in df.iterrows():
        gid = row["GAME_ID"]
        if gid in seen:
            continue
        seen.add(gid)
        matchup = row["MATCHUP"]
        if "vs." in matchup:
            home_team, away_team = matchup.split(" vs. ")
        else:
            away_team, home_team = matchup.split(" @ ")
        results.append({
            "game_id": gid,
            "home_team": home_team.strip(),
            "away_team": away_team.strip(),
            "label": f"{home_team.strip()} vs {away_team.strip()}",
            "status": row["WL"] or "",
        })
    return results


def get_players(game_id: str) -> list[dict]:
    box = boxscoretraditionalv3.BoxScoreTraditionalV3(game_id=game_id, headers=_HEADERS)
    df = box.player_stats.get_data_frame()
    return [
        {"player_id": int(row["personId"]), "name": f"{row['firstName']} {row['familyName']}", "team": row["teamTricode"]}
        for _, row in df.iterrows()
    ]


_STAT_LABELS = {
    "FGM": "Made Field Goals",
    "FG3M": "Made 3-Pointers",
    "FTM": "Made Free Throws",
    "REB": "Rebounds",
    "AST": "Assists",
    "BLK": "Blocks",
    "STL": "Steals",
    "TOV": "Turnovers",
}

_STAT_COL = {
    "FGM": "fieldGoalsMade",
    "FG3M": "threePointersMade",
    "FTM": "freeThrowsMade",
    "REB": "reboundsTotal",
    "AST": "assists",
    "BLK": "blocks",
    "STL": "steals",
    "TOV": "turnovers",
}

def get_available_stat_types(game_id: str, player_id: int) -> list[dict]:
    box = boxscoretraditionalv3.BoxScoreTraditionalV3(game_id=game_id, headers=_HEADERS)
    df = box.player_stats.get_data_frame()
    player = df[df["personId"] == player_id]
    if player.empty:
        return []
    row = player.iloc[0]
    return [
        {"id": stat_id, "label": label}
        for stat_id, label in _STAT_LABELS.items()
        if _STAT_COL[stat_id] in row.index and row[_STAT_COL[stat_id]] and row[_STAT_COL[stat_id]] > 0
    ]


def _matches_stat(row: dict, player_id: int, stat: str, family_name: str | None) -> bool:
    action_type = row.get("actionType", "")
    person_id = row.get("personId", 0)
    desc = row.get("description", "")
    if stat == "FGM":
        return action_type == "Made Shot" and person_id == player_id
    if stat == "FG3M":
        return action_type == "Made Shot" and person_id == player_id and row.get("shotValue") == 3
    if stat == "FTM":
        return action_type == "Free Throw" and person_id == player_id and "PTS" in desc
    if stat == "REB":
        return action_type == "Rebound" and person_id == player_id
    if stat == "AST":
        # Assist attribution is embedded in Made Shot description: "(FamilyName N AST)"
        return (action_type == "Made Shot" and family_name is not None
                and f"{family_name} " in desc and "AST" in desc)
    if stat == "BLK":
        return action_type == "" and person_id == player_id and "BLK" in desc
    if stat == "STL":
        return action_type == "" and person_id == player_id and "STL" in desc
    if stat == "TOV":
        return action_type == "Turnover" and person_id == player_id
    return False


def get_play_event_nums(game_id: str, player_id: int, stat_types: list[str]) -> list[int]:
    pbp = playbyplayv3.PlayByPlayV3(game_id=game_id, headers=_HEADERS)
    df = pbp.play_by_play.get_data_frame()

    # Resolve player family name for assist matching (only when needed)
    family_name: str | None = None
    if "AST" in stat_types:
        box = boxscoretraditionalv3.BoxScoreTraditionalV3(game_id=game_id, headers=_HEADERS)
        bdf = box.player_stats.get_data_frame()
        player_row = bdf[bdf["personId"] == player_id]
        if not player_row.empty:
            family_name = player_row.iloc[0]["familyName"]

    event_nums: set[int] = set()
    for _, row in df.iterrows():
        r = row.to_dict()
        for stat in stat_types:
            if _matches_stat(r, player_id, stat, family_name):
                event_nums.add(int(row["actionNumber"]))
                break
    return sorted(event_nums)


def get_video_url(game_id: str, event_num: int) -> str | None:
    ve = videoeventsasset.VideoEventsAsset(game_id=game_id, game_event_id=event_num, headers=_HEADERS, timeout=15)
    data = ve.get_dict()
    urls = data.get("resultSets", {}).get("Meta", {}).get("videoUrls", [])
    if not urls:
        return None
    return urls[0].get("murl") or urls[0].get("lurl") or urls[0].get("surl")
