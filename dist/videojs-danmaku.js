(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('video.js')) :
  typeof define === 'function' && define.amd ? define(['video.js'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.videojs));
}(this, (function (videojs) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var videojs__default = /*#__PURE__*/_interopDefaultLegacy(videojs);

  const defaults = {
    submit: text => {}
  };
  const registerPlugin = videojs__default['default'].registerPlugin || videojs__default['default'].plugin;
  const vjsCmpt = videojs__default['default'].getComponent('Component');

  class DanmakuEditor extends vjsCmpt {
    constructor(player, options) {
      super(player, options);
      this.options = options;
      this.player = player;
    }

    submit(comment) {
      this.options.submit({
        'progress': parseInt(this.player.currentTime()),
        'comment': comment,
        'username': 'me'
      });
    }

    createEl() {
      let danmakuEle = videojs__default['default'].dom.createEl('div', {
        className: 'vjs-danmaku-editor'
      });
      let danmakuInput = videojs__default['default'].dom.createEl('input', {
        className: 'vjs-danmaku-input',
        type: 'text'
      });
      let danmakuBtn = videojs__default['default'].dom.createEl('button', {
        className: 'vjs-danmaku-button'
      });
      videojs__default['default'].dom.textContent(danmakuBtn, 'Sent');
      videojs__default['default'].on(danmakuBtn, 'click', () => {
        danmakuInput.value && this.submit(danmakuInput.value);
        danmakuInput.value = '';
      });
      videojs__default['default'].dom.appendContent(danmakuEle, danmakuInput);
      videojs__default['default'].dom.appendContent(danmakuEle, danmakuBtn);
      return danmakuEle;
    }

  }

  class DanmakuLayout extends vjsCmpt {
    constructor(player, options) {
      super(player, options);
      this.danmakuMap = {};

      if (options.danmaku.length) {
        options.danmaku.forEach(v => {
          if (!(v.progress in this.danmakuMap)) {
            this.danmakuMap[v.progress] = [];
          }

          this.danmakuMap[v.progress].push(v);
        });
      }

      let lock;
      player.on('timeupdate', () => {
        let _idx = parseInt(player.currentTime());

        if (_idx === lock) {
          return;
        }

        lock = _idx;

        if (_idx in this.danmakuMap) {
          this.danmakuMap[_idx].forEach(v => this.addItem(v));
        }
      });
    }

    append(data) {
      const _pgrs = data.progress++;

      if (_pgrs in this.danmakuMap) {
        this.danmakuMap[_pgrs].push(data);
      } else {
        this.danmakuMap[_pgrs] = [data];
      }
    }

    createEl() {
      this.layout = videojs__default['default'].dom.createEl('div', {
        className: 'vjs-danmaku-layout'
      });
      return this.layout;
    }

    addItem(item) {
      let itemEl = videojs__default['default'].dom.createEl('div', {
        className: 'vjs-danmaku-item'
      });
      videojs__default['default'].dom.textContent(itemEl, `${item.username}: ${item.comment}`);
      videojs__default['default'].dom.appendContent(this.layout, itemEl);
      setTimeout(() => {
        this.layout.removeChild(itemEl);
      }, 5000);
    }

  }

  vjsCmpt.registerComponent('DanmakuEditor', DanmakuEditor);
  vjsCmpt.registerComponent('DanmakuLayout', DanmakuLayout);

  const danmakus = function (options) {
    this.ready(() => {
      let _options = videojs__default['default'].mergeOptions(defaults, options);

      const layout = this.addChild('DanmakuLayout', _options);

      const submitWrap = data => {
        layout.append(data);

        _options.submit(data);
      };

      this.controlBar.addChild('DanmakuEditor', { ..._options,
        submit: submitWrap
      }, 15);
    });
  };

  registerPlugin('danmakus', danmakus);

})));
