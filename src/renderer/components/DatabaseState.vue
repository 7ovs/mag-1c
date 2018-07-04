<template>
  <div class="database-state" :class="view.styleClass">
    <i class="m-1c"></i>
    <div class="label">DATABASE</div>
  </div>
</template>

<script>
import { Observable, Subscription } from 'rxjs'
import { tap, mapTo, switchMap, timeout, catchError, distinctUntilChanged, map, shareReplay } from 'rxjs/operators'
import sql from 'mssql'

const config = {
  user: 'ovs',
  password: 'C0nvent-12',
  server: '192.168.100.5',
  port: 1056,
  database: 'TRG-SKLAD'
}

export default {
  name: 'DatabaseState',
  stateMachine: {
    init: 'INIT',
    transitions: {
      'INIT': {
        'connect': 'CONNECTED',
        'disconnect': 'DISCONNECTED'
      },
      'CONNECTED': {
        'disconnect': 'DISCONNECTED'
      },
      'DISCONNECTED': {
        'connect': 'CONNECTED'
      }
    }
  },
  states: {
    INIT: {
      styleClass: ''
    },
    CONNECTED: {
      styleClass: 'connected'
    },
    DISCONNECTED: {
      styleClass: 'disconnected'
    }
  },
  mounted () {
    const vm = this
    this.subs.add(Observable.interval(3000).pipe(
      switchMap(v => {
        return Observable.fromPromise(vm.pingemu()).pipe(
          mapTo('connect'),
          timeout(2000),
          catchError(_ => Observable.of('disconnect'))
        )
      }, (...args) => args[1]),
      distinctUntilChanged(),
      tap(v => console.log(v)),
      map(event => ({event}))
    ).subscribe(vm.$fsm.event$))
  },
  beforeDestroy () {
    if (this.subs) {
      this.subs.unsubscribe()
    }
  },
  subscriptions () {
    this.subs = new Subscription()
    this.stateChange$ = this.$fsm.state$.pipe(distinctUntilChanged(), shareReplay())
    this.subs.add(this.stateChange$.subscribe(state => this.$emit('state', state)))
    return {
      // view: this.$fsm.state$.pipe(distinctUntilChanged(), map(state => this.$options.states[state]))
      view: this.stateChange$.pipe(map(state => this.$options.states[state]))
    }
  },
  methods: {
    pingemu () {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve()
        }, 100)
      })
    },
    async ping () {
      let t1, t2
      t1 = Date.now()
      try {
        const pool = await sql.connect(config)
        await pool.request().query(`SELECT 1`)
      } catch (err) {
        console.log(err)
      } finally {
        sql.close()
      }
      t2 = Date.now()
      this.result += `TIME ${t2 - t1} ms\n`
      setTimeout(async () => this.test(), 1000)
    }
  }
}
</script>

<style lang="stylus">

.database-state
  height: 72px
  display: flex
  align-items: center
  justify-content: space-between
  flex-direction: column
  .label
    font-size: 21px
    margin-top: 5px
    color: #555
    text-shadow: 0 1px 0 rgba(white, .4)
  .m-1c:before
    font-size: 36px
    color: #555
    text-shadow: 0 1px 0 rgba(255, 255, 255, .4)

.connected
  .m-1c:before
    color: #015905
  .label
    color: #003F02

.disconnected 
  .m-1c:before
    color: #814848
 .label
    color: #5C3333
</style>
