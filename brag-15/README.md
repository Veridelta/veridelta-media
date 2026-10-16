# The 15-second cut

A quick promo for people who will not watch a minute. It has no voice, only music and sound effects. It opens on a failed run at `0.0%`, shows the logo on the music's drop, then declare, suggest, and accept, and ends on a passed run at `100.0%` and the install line.

It was made with brag-slim, the short form of [brag](https://github.com/latent-spaces/brag), and renders with [Hyperframes](https://hyperframes.heygen.com/) 0.8.143. The fonts, logo, music, and sound effects are the 60-second demo's, in `brag/`. Every terminal line on screen comes from that demo's weather station run.

## Rendering

In `composition/`, run `npx hyperframes check`, then `npx hyperframes render --quality high --output ../brag.raw.mp4`. The finished `brag.mp4` sets the mix to -16 LUFS, as `brag/finish.sh` does, and puts the end card in as its first frame, so players show it before the video starts. Git ignores the render and its poster.

[share-copy.txt](share-copy.txt) is the caption to post it with.

Music: Sascha Ende, "Happy Beats / Business Moves, Vol. 1", ende.app, CC BY 4.0.
