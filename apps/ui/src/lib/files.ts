import { removeThisWhenYouNeedMe } from "./general-helpers"

export const downloadBlob = (blob: Blob, fileName: string) => {
  removeThisWhenYouNeedMe("downloadBlob") // TODO: May need to rename to accessBlob for template access

  const fileUrl = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = fileUrl
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const openBlobInNewTab = (blob: Blob) => {
  removeThisWhenYouNeedMe("openBlobInNewTab")

  const file = window.URL.createObjectURL(blob)
  window.open(file, "_blank")
}
