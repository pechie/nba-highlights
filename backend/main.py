import os
import tempfile
from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from nba import (
    get_games,
    get_players,
    get_available_stat_types,
    get_play_event_nums,
    get_video_url,
)
from video import download_clip, compile_reel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/games")
def games_endpoint(date: str):
    return get_games(date)


@app.get("/games/{game_id}/players")
def players_endpoint(game_id: str):
    return get_players(game_id)


@app.get("/games/{game_id}/players/{player_id}/stat-types")
def stat_types_endpoint(game_id: str, player_id: int):
    return get_available_stat_types(game_id, player_id)


class CompileRequest(BaseModel):
    game_id: str
    player_id: int
    stat_types: list[str]


@app.post("/highlights/compile")
def compile_endpoint(req: CompileRequest):
    event_nums = get_play_event_nums(req.game_id, req.player_id, req.stat_types)
    if not event_nums:
        raise HTTPException(status_code=404, detail="No matching plays found for the selected stats")

    with tempfile.TemporaryDirectory() as tmpdir:
        clip_paths = []
        print(f"[compile] {len(event_nums)} events: {event_nums}")
        for i, event_num in enumerate(event_nums):
            try:
                url = get_video_url(req.game_id, event_num)
                print(f"[compile] event {event_num} -> url: {url!r}")
                if not url:
                    continue
                dest = os.path.join(tmpdir, f"clip_{i:04d}.mp4")
                download_clip(url, dest)
                clip_paths.append(dest)
                print(f"[compile] downloaded clip {i}")
            except Exception as e:
                print(f"[compile] event {event_num} failed: {e}")
                continue

        if not clip_paths:
            raise HTTPException(status_code=404, detail="No video clips available for the selected plays")

        output_path = os.path.join(tmpdir, "reel.mp4")
        compile_reel(clip_paths, output_path)
        with open(output_path, "rb") as f:
            video_data = f.read()

    return Response(content=video_data, media_type="video/mp4")
