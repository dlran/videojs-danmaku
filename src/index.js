import videojs from 'video.js'


const defaults = {
  submit: text => {}
}
const registerPlugin = videojs.registerPlugin || videojs.plugin
const vjsCmpt = videojs.getComponent('Component')

class DanmakuEditor extends vjsCmpt {
  constructor(player, options) {
    super(player, options)
    this.options = options
    this.player = player
  }
  submit (comment) {
    this.options.submit({
      'progress': parseInt(this.player.currentTime()),
      'comment': comment,
      'username': 'me'
    })
  }
  createEl () {
    let danmakuEle = videojs.dom.createEl('div', {
      className: 'vjs-danmaku-editor',
    })
    let danmakuInput = videojs.dom.createEl('input', {
      className: 'vjs-danmaku-input',
      type: 'text'
    })
    let danmakuBtn = videojs.dom.createEl('button', {
      className: 'vjs-danmaku-button',
    })
    videojs.dom.textContent(danmakuBtn, 'Sent');
    videojs.on(danmakuBtn, 'click', () => {
      danmakuInput.value && this.submit(danmakuInput.value)
      danmakuInput.value = ''
    })
    videojs.dom.appendContent(danmakuEle, danmakuInput)
    videojs.dom.appendContent(danmakuEle, danmakuBtn)
    return danmakuEle
  }
}
class DanmakuLayout extends vjsCmpt {
  constructor(player, options) {
    super(player, options)
    this.danmakuMap = {}
    if (options.danmaku.length) {
      options.danmaku.forEach(v => {
        if (!(v.progress in this.danmakuMap)) {
          this.danmakuMap[v.progress] = []
        }
        this.danmakuMap[v.progress].push(v)
      })
    }
    let lock
    player.on('timeupdate', () => {
      let _idx = parseInt(player.currentTime())
      if (_idx === lock) { return }
      lock = _idx
      if (_idx in this.danmakuMap) {
        this.danmakuMap[_idx].forEach(v => this.addItem(v))
      }
    })
  }
  append (data) {
    const _pgrs = data.progress ++
    if (_pgrs in this.danmakuMap) {
      this.danmakuMap[_pgrs].push(data)
    } else {
      this.danmakuMap[_pgrs] = [data]
    }
  }
  createEl () {
    this.layout = videojs.dom.createEl('div', {
      className: 'vjs-danmaku-layout',
    })
    return this.layout
  }
  addItem (item) {
    let itemEl = videojs.dom.createEl('div', {
      className: 'vjs-danmaku-item'
    })
    videojs.dom.textContent(itemEl, `${item.username}: ${item.comment}`)
    videojs.dom.appendContent(this.layout, itemEl)
    setTimeout(() => {
      this.layout.removeChild(itemEl)
    }, 5000)
  }
}

vjsCmpt.registerComponent('DanmakuEditor', DanmakuEditor);
vjsCmpt.registerComponent('DanmakuLayout', DanmakuLayout);

const danmakus = function (options) {
  this.ready(() => {
    let _options = videojs.mergeOptions(defaults, options)
    const layout = this.addChild('DanmakuLayout', _options)
    const submitWrap = data => {
      layout.append(data)
      _options.submit(data)
    }
    this.controlBar.addChild('DanmakuEditor', {..._options, submit: submitWrap}, 15)
  })
}

registerPlugin('danmakus', danmakus)


