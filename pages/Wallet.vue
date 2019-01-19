<template>
  <section>
    <section>
      <v-data-table
        :headers="headers"
        :items="ethAccounts"
        :rowsPerPage="[1,2,3]"
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td>
            <b
              v-if="props.item.address === currentAddress"
            >{{ props.item.address }}</b>
            <span
              v-if="props.item.address !== currentAddress"
            >{{ props.item.address }}</span>
          <td>{{ props.item.balance }}</td>
        </template>
      </v-data-table>
    </section>
    <section>
      <v-card>
        <v-card-title primary-title>
          <h4>Send Eth</h4>
        </v-card-title>
        <v-form v-on:submit.prevent="submit">
          <v-text-field
            prepend-icon="person"
            name="Recipient Address"
            label="Recipient Address"
            v-model="ethForm.recipientAddress"
          ></v-text-field>
          <v-text-field
            prepend-icon="lock"
            name="Password"
            label="Password"
            type="password"
            v-model="ethForm.password"
          ></v-text-field>
          <v-text-field
            prepend-icon="attach_money"
            name="Amount" label="Amount"
            type="number"
            v-model="ethForm.amount"
          ></v-text-field>
          <v-card-actions>
            <v-btn type="submit" primary large block>Send</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </section>
  </section>
</template>

<script lang="ts">
  import {
    Action,
    Component, State,
    Vue
  } from "nuxt-property-decorator"
  import Web3 from 'web3';
  import { EthAccount } from '~/models/eth_account';

  interface Process {
    browser: boolean
  }

  declare var process: Process;

  interface Window {
    web3: Web3
  }

  declare var window: Window;

  @Component({
    name: 'wallet'
  })
  export default class extends Vue {
    @State ethAccounts: EthAccount[];
    @State currentAddress: string;

    @Action('fetchAccounts') fetchAccounts;
    @Action('sendEth') sendEth;

    web3: Web3;

    ethForm = {
      recipientAddress: '',
      password: '',
      amount: 0,
    };

    created() {
      // let web3 = new Web3('http://localhost:7545');

      if (process.browser) {
        if (typeof window.web3 !== 'undefined') {
          window.web3 = new Web3(window.web3.currentProvider);
        } else {
          console.log('error');
        }

        this.web3 = window.web3;

        this.fetchAccounts(this.web3);
      }
    }

    submit() {
      const payload = {
        web3: this.web3,
        sendEthRequest: {
          ...
            this.ethForm,
          senderAddress: this.currentAddress
        }
      };
      this.sendEth(payload);
      this.ethForm = {
        recipientAddress: '',
        password: '',
        amount: 0
      };
    }

    headers = [
      {text: 'Address', value: 'address'},
      {text: 'Balance', value: 'balanace'},
    ];
  }
</script>

<style scoped>
  section {
    margin: 20px;
  }

  v-card {
    margin-top: 20px;
  }

  form {
    margin: 10px;
  }
</style>
