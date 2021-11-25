import '@logseq/libs'
import React from 'react'
import ReactDOM from 'react-dom'
import 'antd/dist/antd.css'
import MarkdownIt from 'markdown-it'

import './index.css'
import App from './pages/App'
import { DEFAULT_TABLE } from './utils/contants'
import parseMarkdownTable from './utils/parseRawInputByMarkdownIt'

const md = new MarkdownIt()

const logseq = window.logseq
const logseqEditor = logseq.Editor
const logseqApp = logseq.App

logseq.ready().then(() => {
  // padding-left: var(--ls-left-sidebar-width);
  logseq.provideStyle(`
    iframe#logseq-markdown-table.lsp-iframe-sandbox {
      z-index: 10;
    }
  `)
  console.log('[faiz:] === markdown-table-editor-plugin loaded')
  logseqEditor.registerBlockContextMenuItem('markdown-table-editor', (e) => {
    console.log('[faiz:] === woz-markdown-table-editor', e)
    logseqEditor.getBlock(e.uuid).then(block => {
      console.log('[faiz:] === block', block)
      const { format, content } = block
      // only support markdown
      if (format !== 'markdown') return logseqApp.showMsg('woz-markdown-table-editor only support markdown', 'warning')
      // for empty block
      if (content === '') return renderApp(DEFAULT_TABLE, e.uuid)

      const tables = parseMarkdownTable(content)
      if (tables?.length > 0) {
        const [startLine, endLine] = tables[0]
        const firstTable = content.split('\n').slice(startLine, endLine).join('\n')
        console.log('[faiz:] === firstTable', content, firstTable, startLine, endLine)
        return renderApp(firstTable, e.uuid)
      }

      // const renderHtml = md.render(content)
      // if (renderHtml.startsWith('<table>') && (renderHtml.endsWith('</table>') || renderHtml.endsWith('</table>\n'))) {
      //   return renderApp(content || DEFAULT_TABLE, e.uuid)
      // }
      // format to table error
      window.logseq.App.showMsg('Sorry, block content format to markdown table error', 'warning')
      console.log('[faiz:] === block content format to markdown table error', tables)
    })
  })

  logseq.on('ui:visible:changed', (e) => {
    if (!e.visible) {
      ReactDOM.unmountComponentAtNode(document.getElementById('root'));
    }
  });
})

const renderApp = (cntent, tables, blockId) => {
  ReactDOM.render(
    <React.StrictMode>
      <App content={content} tables={tables} blockId={blockId} />
    </React.StrictMode>,
    document.getElementById('root')
  )
  logseq.showMainUI()
}


// debug
// renderApp()
