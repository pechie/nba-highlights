import requests
import ffmpeg


_VIDEO_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0",
    "Referer": "https://www.nba.com/",
    "Origin": "https://www.nba.com",
    "Accept": "*/*",
}

def download_clip(url: str, dest_path: str, timeout: int = 60) -> None:
    with requests.get(url, stream=True, timeout=timeout, headers=_VIDEO_HEADERS) as r:
        r.raise_for_status()
        with open(dest_path, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)


def compile_reel(clip_paths: list[str], output_path: str) -> str:
    if not clip_paths:
        raise ValueError("No clips to compile")
    streams = []
    for p in clip_paths:
        inp = ffmpeg.input(p)
        streams.extend([inp.video, inp.audio])
    joined = ffmpeg.concat(*streams, v=1, a=1)
    joined.output(output_path).overwrite_output().run(quiet=True)
    return output_path
