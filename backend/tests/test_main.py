# backend/tests/test_main.py
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


@patch("main.get_games")
def test_get_games(mock_fn):
    mock_fn.return_value = [
        {"game_id": "0022501054", "home_team": "OKC", "away_team": "BOS",
         "label": "OKC vs BOS", "status": "Final"}
    ]
    r = client.get("/games?date=2025-03-01")
    assert r.status_code == 200
    assert r.json()[0]["game_id"] == "0022501054"
    mock_fn.assert_called_once_with("2025-03-01")


def test_get_games_missing_date():
    r = client.get("/games")
    assert r.status_code == 422


@patch("main.get_players")
def test_get_players(mock_fn):
    mock_fn.return_value = [{"player_id": 1629029, "name": "SGA", "team": "OKC"}]
    r = client.get("/games/0022501054/players")
    assert r.status_code == 200
    assert r.json()[0]["player_id"] == 1629029
    mock_fn.assert_called_once_with("0022501054")


@patch("main.get_available_stat_types")
def test_get_stat_types(mock_fn):
    mock_fn.return_value = [{"id": "FGM", "label": "Made Field Goals"}]
    r = client.get("/games/0022501054/players/1629029/stat-types")
    assert r.status_code == 200
    assert r.json()[0]["id"] == "FGM"
    mock_fn.assert_called_once_with("0022501054", 1629029)


@patch("main.compile_reel")
@patch("main.download_clip")
@patch("main.get_video_url")
@patch("main.get_play_event_nums")
def test_compile_returns_mp4(mock_events, mock_video_url, mock_download, mock_compile):
    mock_events.return_value = [10]
    mock_video_url.return_value = "https://cdn.nba.com/clip.mp4"

    def fake_compile(clip_paths, output_path):
        with open(output_path, "wb") as f:
            f.write(b"fake_video")
        return output_path
    mock_compile.side_effect = fake_compile

    r = client.post("/highlights/compile", json={
        "game_id": "0022501054", "player_id": 1629029, "stat_types": ["FGM"]
    })
    assert r.status_code == 200
    assert r.headers["content-type"] == "video/mp4"
    assert r.content == b"fake_video"


@patch("main.get_play_event_nums")
def test_compile_404_no_events(mock_events):
    mock_events.return_value = []
    r = client.post("/highlights/compile", json={
        "game_id": "0022501054", "player_id": 1629029, "stat_types": ["FGM"]
    })
    assert r.status_code == 404


@patch("main.get_video_url")
@patch("main.get_play_event_nums")
def test_compile_404_no_clips(mock_events, mock_video_url):
    mock_events.return_value = [10]
    mock_video_url.return_value = None
    r = client.post("/highlights/compile", json={
        "game_id": "0022501054", "player_id": 1629029, "stat_types": ["FGM"]
    })
    assert r.status_code == 404
