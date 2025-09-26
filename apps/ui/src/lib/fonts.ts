import { Instrument_Sans, Instrument_Serif, Roboto } from "next/font/google"

export const fontRoboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700"],
  variable: "--font-roboto",
})

export const fontInstrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument-sans",
})

export const fontInstrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  variable: "--font-instrument-serif",
})
