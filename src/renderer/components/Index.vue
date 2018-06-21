<template>
  <div>
    <database-state></database-state>
    <button @click="test">ping</button>
    <div>
      <pre>
        {{result}}
      </pre>
    </div>
  </div>
</template>

<script>
import sql from 'mssql'
import DatabaseState from './DatabaseState'
const config = {
  user: 'ovs',
  password: 'C0nvent-12',
  server: '192.168.100.5',
  port: 1056,
  database: 'TRG-SKLAD'
}

export default {
  name: 'welcome',
  data () {
    return {
      result: ''
    }
  },
  methods: {
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
    DatabaseState
  }
}
</script>

<style>
</style>
