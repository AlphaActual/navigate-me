export const state = () => ({
    tutorialVisible: false,
    isLoggedIn: false,
})


export const mutations = {
    toggleTutorial(state) {
        state.tutorialVisible = !state.tutorialVisible;
    },
    toggleLogged(state) {
        state.isLoggedIn = !state.isLoggedIn;
    }
}

// ako zelis samo citati vrijednost isLoggedIn onda
// this.$store.state.isLoggedIn

// ako zelis mijenjati vrijednost isLoggedIn onda
// this.$store.commit('toggleLogged')