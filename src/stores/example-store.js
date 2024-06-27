import { defineStore } from 'pinia';

let id = 0

export const usePiniaStore = defineStore('counter', {
  state: () => ({
    counter: 0,
    entries: [
      {
        id: id++,
        name: 'Phone',
        amount: -3999,
        isPaid: true,
      },
      {
        id: id++,
        name: 'Unknown',
        amount: 0,
        isPaid: false,
      },
      {
        id: id++,
        name: 'House',
        amount: -6999,
        isPaid: true,
      },
    ],
    textAmount: '',
    numAmount: null,
  }),
  getters: {
    balance: (state) => {
      return state.entries.reduce((accumulator, entry) => {
        return accumulator + entry.amount
      }, 0)
    },
    paid: (state) => {
      return state.entries.reduce((accumulator, entry) => {
        return entry.isPaid ? accumulator + entry.amount : accumulator
      }, 0)
    }
  },
  actions: {
    addExpense() {
      let expenses = { id: id++, name: this.textAmount, amount: parseFloat(this.numAmount), isPaid: false }
      this.entries.push(expenses)
      this.textAmount = ''
      this.numAmount = ''
    },
    deleteEntry(entryId) {
      const index =  this.entries.findIndex((entry) => entry.id === entryId)
      this.entries.splice(index, 1)
    },
  },
});
