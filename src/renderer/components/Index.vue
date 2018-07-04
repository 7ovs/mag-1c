<template>
  <div class="main-view">
    <div class="title">MAGTOOL PRICE’S CHANGE UPLOADER</div>

    <div class="mrow">
      <div class="mblock">
        <database-state class="mflex" v-stream:state="dbState$"></database-state>
        <mag-button class="mt-5" v-stream:click="loadClick$" :disabled="view.loadButtonDisabled">LOAD</mag-button>
      </div>

      <div class="mblock">
        <i class="m-long-arrow-right"></i>
      </div>

      <div class="mblock">
        <div class="mflex" style="height: 72px"><i class="m-datafile"></i></div>
        <mag-button class="mt-5" v-stream:click="viewClick$" :disabled="view.viewButtonDisabled">VIEW</mag-button>
      </div>

      <div class="mblock">
        <i class="m-long-arrow-right"></i>
      </div>
      
      <div class="mblock">
        <server-state class="mflex"></server-state>
        <mag-button class="mt-5" v-stream:click="sendClick$" :disabled="view.sendButtonDisabled">SEND</mag-button>
      </div>
    </div>

  </div>
</template>

<script>
// import Vue from 'vue'
import sql from 'mssql'
import DatabaseState from './DatabaseState'
import ServerState from './ServerState'
import MagButton from './MagButton'
import { combineLatest, Subscription } from 'rxjs'
import { filter, pluck, mapTo, tap, distinctUntilChanged, shareReplay, map } from 'rxjs/operators'
const config = {
  user: 'ovs',
  password: 'C0nvent-12',
  server: '192.168.100.5',
  port: 1056,
  database: 'TRG-SKLAD'
}

export default {
  name: 'MainView',
  data () {
    return {
      result: ''
    }
  },
  // mounted () {
  // debugger
  // const a = []
  // setInterval(() => { if (a.length > 0) { console.log(a); a.pop() } }, 1)
  // this.$watch(this.result, () => {
  //   console.log('result change')
  // })
  // Vue.nextTick(() => {
  //   console.log('nexttick')
  // })
  // Vue.set('result', 'test', [1, 2, 3])
  // },
  stateMachine: {
    init: 'INIT',
    transitions: {
      'INIT': {
        'db-connect': 'READY_FOR_LOAD'
      },
      'READY_FOR_LOAD': {
        'load': 'LOADING'
      },
      'LOADING': {
        'load-failed': 'INIT',
        'load-success': 'LOADED'
      },
      'LOADED': {
        'view': 'VIEWING',
        'load': 'LOADING',
        'srv-connect': 'READY_FOR_SEND'
      },
      'VIEWING': {
        'close': 'LOADED'
      },
      'READY_FOR_SEND': {
        'view': 'VIEWING',
        'send': 'SENDING',
        'load': 'LOADING'
      },
      'SENDING': {
        'send-failed': 'LOADED',
        'send-success': 'SENDED'
      },
      'SENDED': {
        'view': 'VIEWING',
        'send': 'SENDING',
        'load': 'LOADING'
      }
    }
  },

  states: {
    INIT: {
      loadButtonDisabled: true,
      viewButtonDisabled: true,
      sendButtonDisabled: true
    },
    READY_FOR_LOAD: {
      loadButtonDisabled: false,
      viewButtonDisabled: true,
      sendButtonDisabled: true
    },
    LOADING: {
      loadButtonDisabled: true,
      viewButtonDisabled: true,
      sendButtonDisabled: true
    }
  },

  domStreams: ['dbState$', 'loadClick$', 'viewClick$', 'sendClick$'],

  created () {
    this.subs = new Subscription()
  },

  beforeDestroy () {
    if (this.subs) {
      this.subs.unsubscribe()
    }
  },

  mounted () {
    this.subs.add(combineLatest(
      this.$fsm.state$.pipe(
        filter(s => s === 'INIT')),
      this.dbState$.pipe(
        pluck('event', 'msg'),
        filter(s => s === 'CONNECTED'))
    ).pipe(mapTo({ event: 'db-connect' })).subscribe(this.$fsm.event$))

    this.subs.add(this.dbState$.pipe(
      pluck('event', 'msg'),
      filter(s => s === 'DISCONNECTED'),
      mapTo({ event: 'db-disconnect' })
    ).subscribe(this.$fsm.event$))

    this.subs.add(this.loadClick$.pipe(mapTo({ event: 'load' })).subscribe(this.$fsm.event$))
    this.subs.add(this.viewClick$.pipe(mapTo({ event: 'view' })).subscribe(this.$fsm.event$))
    this.subs.add(this.sendClick$.pipe(mapTo({ event: 'send' })).subscribe(this.$fsm.event$))
  },

  subscriptions () {
    return {
      state: this.$fsm.state$.pipe(distinctUntilChanged())
    }
  },

  computed: {
    view () {
      return this.$options.states[this.state]
    }
  },

  methods: {
    async load () {
      // try {
      //   const result = await fetch()
      //   this.$fsm.signal('load-success')
      // } catch (error) {
      //   this.$fsm.signal('load-failed')
      // }
    },
    async send () {
      // try {
      //   const result = await fetch()
      //   this.$fsm.signal('send-success')
      // } catch (error) {
      //   this.$fsm.signal('send-failed')
      // }
    },
    async test () {
      let t1, t2
      t1 = Date.now()
      try {
        // this.result += `connecting...\n`
        const pool = await sql.connect(config)
        // this.result += `connected!\n`

        // this.result += `query...\n`
        await pool.request().query(`SELECT 1`)
        // this.result += `query complete!\n`

        // this.result += JSON.stringify(result, null, '  ') + '\n'
      } catch (err) {
        this.result += `ERROR ${err.message}\n`
        console.log(err)
      } finally {
        sql.close()
      }
      t2 = Date.now()
      this.result += `TIME ${t2 - t1} ms\n`
      setTimeout(async () => this.test(), 1000)
    }
  },
  components: {
    DatabaseState,
    ServerState,
    MagButton
  }
}
</script>

<style scoped>
.main-view {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  box-shadow: inset 0 0 15px rgba(0, 0, 0, .2)
}
.mrow {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.title {
  color: #555;
  text-shadow: 0 1px 0 rgba(255, 255, 255, .4);
  margin-bottom: 80px;
}
.mflex {
  display: flex;
}
.mblock {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
}
.mbtn {
  display: flex;
  background: #D8D8D8;
  color: #6A6A6A;
  padding: 9px 32px;
  font: 300 18px 'Roboto-Condensed';
  text-shadow: 0 1px 0 rgba(255, 255, 255, .4);
  border-radius: 3px;
  border: 1px solid #979797;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .6), 0 1px 4px rgba(0, 0, 0, .25);
  transition: background .7s ease;
  transition-property: background, box-shadow
}

.mbtn:hover {
  background: #f8f8f8;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .6), 0 1px 4px rgba(0, 0, 0, .25), 0 0 15px rgba(255, 255, 255, .33);
}

.m-datafile:before {
  font-size: 56px;
  color: #555;
  text-shadow: 0 1px 0 rgba(255, 255, 255, .4);
}
.m-long-arrow-right:before {
  font-size: 36px;
  line-height: 72px;
  margin: 0 36px;
  color: #555;
  text-shadow: 0 1px 0 rgba(255, 255, 255, .4);
}
</style>
