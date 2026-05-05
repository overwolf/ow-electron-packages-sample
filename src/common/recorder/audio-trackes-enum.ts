export const enum AudioTracksEnum {
  None = 0,
  Track1 = 1 << 0,
  Track2 = 1 << 1, // 0010
  Track3 = 1 << 2, // 0100
  Track4 = 1 << 3, // 1000
  Track5 = 1 << 4, // 1000
  Track6 = 1 << 5, // 1000
  All = 0xff,
}