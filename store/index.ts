import { ActionTree, MutationTree } from "vuex";
import { Person } from "~/types";
import { EthAccount } from '~/models/eth_account';

export interface RootState {
  people: Person[];
  ethAccounts: EthAccount[];
  currentAddress: string;
  error: Error | null;
}

export const state = (): RootState => ({
  people: [],
  ethAccounts: [],
  currentAddress: '',
  error: null,
});

export const mutations: MutationTree<RootState> = {
  setPeople(state: RootState, people: Person[]): void {
    state.people = people;
  },

  setEthAccounts(state: RootState, ethAccounts: EthAccount[]): void {
    state.ethAccounts = ethAccounts;
  },

  setCurrentAddress(state: RootState, currentAddress: string): void {
    state.currentAddress = currentAddress;
  },

  setError(state: RootState, error: Error): void {
    state.error = error
  }

};

export const actions: ActionTree<RootState, RootState> = {
  async nuxtServerInit({ commit }, { app }) {
    const people: Person[] = await app.$axios.$get(
      "./random-data.json"
    );
    commit("setPeople", people.slice(0, 10));
  },

  async fetchAccounts({ commit }, web3) {
    console.log(web3.eth.defaultAccount);
    return web3.eth.getAccounts()
      .then(addresses => {
        commit('setCurrentAddress', addresses[0]);

        const promises = addresses.map(address => {
          return web3.eth.getBalance(address)
            .then((balance) => {
              return new EthAccount(address, balance)
            });
        });
        return Promise.all(promises);
      })
      .then(accounts => {
        commit("setEthAccounts", accounts);
        return accounts;
      })
      .catch((e: Error) => {
        commit("setError", e);
        return;
      });
  },

  async sendEth({ commit }, { web3, sendEthRequest }) {
    const transaction = {
      to: sendEthRequest.recipientAddress,
      value: sendEthRequest.amount as string,
      from: sendEthRequest.senderAddress,
    };

    return web3.eth.personal
      .sendTransaction(transaction, sendEthRequest.password)
      .then(() => {
        commit('setError', null);
        return;
      })
      .catch((e: Error) => {
        commit("setError", e);
        return;
      });
  },

  async setError({ commit }, error) {
    commit('setError', error);
  }
};
