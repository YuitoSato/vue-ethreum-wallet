<template>
  <section class="wallet-container">
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
        <div class="card-content">
          <p class="error-message" v-if="hasError()">
            {{error.message}}
          </p>
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
        </div>
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
    @State error: Error;

    @Action('fetchAccounts') fetchAccounts;
    @Action('sendEth') sendEth;
    @Action('setError') setError;

    web3: Web3;

    ethForm = {
      recipientAddress: '',
      password: '',
      amount: 0,
    };

    headers = [
      {text: 'Address', value: 'address'},
      {text: 'Balance', value: 'balanace'},
    ];

    created() {
      if (process.browser) {
        if (typeof window.web3 !== 'undefined') {
          window.web3 = new Web3(window.web3.currentProvider);
        } else {
          this.error = new Error("no metamask")
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

    hasError() {
      return !!this.error
    }
  }
</script>

<style scoped>
  .wallet-container {
    width: 1000px;
  }
  section {
    margin: 20px;
  }

  .v-card {
    margin-top: 20px;
    height: 100%;
  }

  .card-content {
    margin: 0 20px 20px 20px;
  }

  .error-message {
    color: red;
  }
</style>
