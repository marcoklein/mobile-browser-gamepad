<template lang="pug">
div
  b-container
    h3 Test Server of Smartphone Gamepad library
    div Connection Code: {{ connectionCode }}

    hr
    h3 Clients
    b-list-group
      b-list-group-item(v-for='item in clients')
        | {{ item.id }} | {{ item.averagePing }}
</template>


<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { RemoteGamepadServer } from '../../network/server/RemoteGamepadServer';
import { HostedConnection } from '../../network/server/HostedConnection';

@Component
export default class TestServerApp extends Vue {

    server: RemoteGamepadServer;
    
    beforeCreate() {
        // initialize
        this.server = new RemoteGamepadServer();
        this.server.start('catchme2').then((id) => {
            // provide connection code to front end
            this.$data.connectionCode = this.server.connectionCode;
        });
    }

    data() {
        return {
            connectionCode: '... connecting ...',
            clients: this.server.clients
        };
    }
    

}
</script>

<style>
</style>

