import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from unittest.mock import MagicMock, patch
import pandas as pd
from nba import get_games, get_players, get_available_stat_types, get_play_event_nums, get_video_url

def _scoreboard_dict():
    return {"scoreboard": {"games": [{
        "gameId": "0022501054",
        "gameStatusText": "Final",
        "homeTeam": {"teamId": 1610612760, "teamTricode": "OKC", "wins": 55, "losses": 16, "score": 110},
        "awayTeam": {"teamId": 1610612738, "teamTricode": "BOS", "wins": 42, "losses": 29, "score": 105},
    }]}}

@patch("nba.scoreboardv3.ScoreboardV3")
def test_get_games_returns_list(mock_cls):
    mock_sb = MagicMock()
    mock_sb.get_dict.return_value = _scoreboard_dict()
    mock_cls.return_value = mock_sb

    result = get_games("2025-03-01")

    assert len(result) == 1
    assert result[0]["game_id"] == "0022501054"
    assert result[0]["home_team"] == "OKC"
    assert result[0]["away_team"] == "BOS"
    assert result[0]["home_pts"] == 110
    assert result[0]["away_pts"] == 105
    assert result[0]["home_record"] == "55-16"
    assert result[0]["away_record"] == "42-29"
    assert result[0]["status"] == "Final"
    assert result[0]["winner"] == "OKC"
    assert result[0]["label"] == "OKC vs BOS"
    assert mock_cls.call_args.kwargs["game_date"] == "03/01/2025"

@patch("nba.commonteamroster.CommonTeamRoster")
@patch("nba.boxscoretraditionalv3.BoxScoreTraditionalV3")
def test_get_players_returns_list(mock_box_cls, mock_roster_cls):
    mock_box = MagicMock()
    mock_box.player_stats.get_data_frame.return_value = pd.DataFrame([
        {"personId": 1629029, "firstName": "Shai", "familyName": "Gilgeous-Alexander", "teamTricode": "OKC", "teamId": 1610612760},
        {"personId": 1628384, "firstName": "Jayson", "familyName": "Tatum", "teamTricode": "BOS", "teamId": 1610612738},
    ])
    mock_box_cls.return_value = mock_box

    mock_roster = MagicMock()
    mock_roster.common_team_roster.get_data_frame.return_value = pd.DataFrame([
        {"PLAYER_ID": 1629029, "NUM": "2"},
        {"PLAYER_ID": 1628384, "NUM": "0"},
    ])
    mock_roster_cls.return_value = mock_roster

    result = get_players("0022501054")

    assert result[0] == {"player_id": 1629029, "name": "Shai Gilgeous-Alexander", "team": "OKC", "jersey": "2"}
    assert result[1] == {"player_id": 1628384, "name": "Jayson Tatum", "team": "BOS", "jersey": "0"}
    assert mock_cls.call_args.kwargs["game_id"] == "0022501054"

@patch("nba.boxscoretraditionalv3.BoxScoreTraditionalV3")
def test_get_available_stat_types_filters_zeros(mock_cls):
    mock_box = MagicMock()
    mock_box.player_stats.get_data_frame.return_value = pd.DataFrame([{
        "personId": 1629029,
        "fieldGoalsMade": 8, "threePointersMade": 2, "freeThrowsMade": 5,
        "reboundsTotal": 3, "assists": 6, "blocks": 0, "steals": 1, "turnovers": 2,
    }])
    mock_cls.return_value = mock_box

    result = get_available_stat_types("0022501054", 1629029)
    ids = [s["id"] for s in result]

    assert "FGM" in ids
    assert "FG3M" in ids
    assert "FTM" in ids
    assert "REB" in ids
    assert "AST" in ids
    assert "BLK" not in ids
    assert "STL" in ids
    assert "TOV" in ids

@patch("nba.playbyplayv3.PlayByPlayV3")
def test_get_play_event_nums_filters_correctly(mock_cls):
    mock_pbp = MagicMock()
    mock_pbp.play_by_play.get_data_frame.return_value = pd.DataFrame([
        # FGM by target player
        {"actionNumber": 10, "actionType": "Made Shot", "personId": 1629029, "shotValue": 2, "description": "SGA 2' Layup (2 PTS)"},
        # FG3M by target player (also counts as FGM — deduped by set)
        {"actionNumber": 20, "actionType": "Made Shot", "personId": 1629029, "shotValue": 3, "description": "SGA 26' 3PT Jump Shot (5 PTS)"},
        # FGM by different player — excluded
        {"actionNumber": 30, "actionType": "Made Shot", "personId": 9999999, "shotValue": 2, "description": "Other 2' Layup (2 PTS)"},
        # REB by target player
        {"actionNumber": 40, "actionType": "Rebound", "personId": 1629029, "shotValue": 0, "description": "SGA REBOUND (Off:1 Def:0)"},
    ])
    mock_cls.return_value = mock_pbp

    result = get_play_event_nums("0022501054", 1629029, ["FGM", "REB"])

    assert set(result) == {10, 20, 40}
    assert mock_cls.call_args.kwargs["game_id"] == "0022501054"

@patch("nba.videoeventsasset.VideoEventsAsset")
def test_get_video_url_returns_lurl(mock_cls):
    mock_ve = MagicMock()
    mock_ve.get_dict.return_value = {
        "resultSets": {"Meta": {"videoUrls": [
            {"lurl": "https://videos.nba.com/clip_large.mp4", "murl": "https://videos.nba.com/clip_medium.mp4", "surl": "https://videos.nba.com/clip_small.mp4"}
        ]}}
    }
    mock_cls.return_value = mock_ve

    url = get_video_url("0022501054", 10)

    assert url == "https://videos.nba.com/clip_large.mp4"
    assert mock_cls.call_args.kwargs["game_id"] == "0022501054"
    assert mock_cls.call_args.kwargs["game_event_id"] == 10

@patch("nba.videoeventsasset.VideoEventsAsset")
def test_get_video_url_returns_none_when_empty(mock_cls):
    mock_ve = MagicMock()
    mock_ve.get_dict.return_value = {"resultSets": {"Meta": {"videoUrls": []}}}
    mock_cls.return_value = mock_ve

    assert get_video_url("0022501054", 10) is None
