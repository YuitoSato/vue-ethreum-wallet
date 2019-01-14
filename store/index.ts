import { MutationTree, ActionTree } from "vuex";
import { Person } from "~/types";
import Web3 from 'web3';

export interface RootState {
  web3: Web3;
  people: Person[];
  errorMessages: string[];
}

export const state = (): RootState => ({
  web3: initWeb3(),
  people: [],
  errorMessages: []
});

export const initWeb3 = (): Web3 => {
  const web3 = new Web3;
  return web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));
};

export const mutations: MutationTree<RootState> = {
  setPeople(state: RootState, people: Person[]): void {
    state.people = people
  },
};

export const actions: ActionTree<RootState, RootState> = {
  async nuxtServerInit({ commit }, { app }) {
    const people: Person[] = await app.$axios.$get(
      "./random-data.json"
    );
    commit("setPeople", people.slice(0, 10));
  }
};
