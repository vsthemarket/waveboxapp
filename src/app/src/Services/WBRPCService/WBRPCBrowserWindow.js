import { ipcMain, BrowserWindow } from 'electron'
import { ElectronWebContents } from 'ElectronTools'
import {
  WBRPC_CLOSE_WINDOW,
  WBRPC_BW_FOCUS
} from 'shared/WBRPCEvents'

const privConnected = Symbol('privConnected')

class WBRPCBrowserWindow {
  /* ****************************************************************************/
  // Lifecycle
  /* ****************************************************************************/

  constructor () {
    this[privConnected] = new Set()
    ipcMain.on(WBRPC_CLOSE_WINDOW, this._handleCloseWindow)
  }

  /**
  * Connects the webcontents
  * @param contents: the webcontents to connect
  */
  connect (contents) {
    this[privConnected].add(contents.id)

    const bw = BrowserWindow.fromWebContents(contents)
    if (bw) {
      bw.on('focus', this._handleFocus)
    }
  }

  /**
  * Disconnects a webcontents
  * @param contentsId: the id of the webcontents that has been disconnected
  */
  disconnect (contentsId) {
    this[privConnected].delete(contentsId)
  }

  /* ****************************************************************************/
  // IPC: WebContent events
  /* ****************************************************************************/

  _handleFocus = (evt) => {
    evt.sender.webContents.send(WBRPC_BW_FOCUS, evt.sender.id, evt.sender.webContents.id)
  }

  /* ****************************************************************************/
  // IPC Events
  /* ****************************************************************************/

  /**
  * Closes the browser window
  * @param evt: the event that fired
  */
  _handleCloseWindow = (evt) => {
    if (!this[privConnected].has(evt.sender.id)) { return }
    const bw = BrowserWindow.fromWebContents(ElectronWebContents.rootWebContents(evt.sender))
    if (!bw || bw.isDestroyed()) { return }
    bw.close()
  }
}

export default WBRPCBrowserWindow