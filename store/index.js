export const state = () => ({
    tutorialVisible: false,
    isLoggedIn: false,
    tutorialSlides1: [
        {   
            id: 0,   
            title: 'Welcome to the Route Planner',
            text: 'Here you can create your route and save it to your profile for later use. <br> You can also load your saved routes and edit them. <br> <br> Click on the next button to continue.',
            elementID: null,
        },
        {   
            id: 1,
            title: 'Zooming and Panning',
            text: 'To start, you can <b> zoom in and out </b> using the <b>mouse wheel</b>. <br> You can also <b>pan</b> the map by <b>clicking and dragging</b> while holding the left mouse button. Try that now! <br> <br> Click on the next button to continue.',
            elementID: null,
        },
        {   
            id: 2,
            title: 'Selecting a waypoint or marker',
            text: 'To select a waypoint or marker and make it <b>active</b>, simply <b>click on it on the chart or in one of the info cards in the side panel</b>. <br> <br> Click on the next button to continue.',
            elementID: ['.leaflet-marker-icon[src="/_nuxt/assets/img/icons/default.png"]','.waypoint-container'],
        },
        {   
            id: 3,
            title: 'Moving and adding a waypoint',
            text: 'When you click on a waypoint you will see a brief description of it\'s parameters and that waypoint will become active one. <br> You can also <b>move the waypoint</b> by <b>clicking on it and then clicking anywhere on the map</b> If the selected waypoint is the last one, instead you will <b>add a new waypoint.</b> <br> <br> Click on the next button to continue.',
            elementID: ['.leaflet-marker-icon[src="/_nuxt/assets/img/icons/default.png"]'],
        },
        {   
            id: 4,
            title: 'Waypoint parameters',
            text: 'When you click on a waypoint you will see the following info: <br> <br> <li>Course to the next wayoint</li> <li>Distance to the next waypoint</li> <li>Speed to the next waypoint</li> <br> Same info can be seen in the side panel where the selected WP card will be colored <span style="color:#ffc107;">yellow</span>. Try clicking on the cards and different waypoints on the map. <br> <br> Click on the next button to continue.',
            elementID: ['.leaflet-marker-icon','.waypoint-container'],
        },
        {   
            id: 5,
            title: 'Deleting a waypoint',
            text: 'To delete a waypoint simply select it by <b>clicking on it</b> on the map or by <b>clicking on its card</b> in the side panel and then press button <b><span style="color:red;">Delete active</span></b>. After the WP is deleted previous WP will become active one. <br> <br> Click on the next button to continue.',
            elementID: ['delete-active'],
        },
        {   
            id: 6,
            title: 'Adjusting the speed between waypoints',
            text: 'To adjust the speed between active and next waypoint first select the <b>Waypoint icon</b> in the side panel , adjust the speed value and press the <b>three arrows icon.</b> <br> Note: Total calculated speed for the route, shown in the nav/info bar, changes as you change each individual speed between WPs  <br> <br> Click on the next button to continue.',
            elementID: ['waypoint-label','speed-input','update-speed-btn','total-time'],
        },
        {   
            id: 7,
            title: 'Inserting a waypoint',
            text: 'To insert a waypoint between two existing waypoints first make sure <b>Waypoint icon</b> is selected in the side panel, optinally adjust the speed (without pressing the arrows button) and press the <b>insert</b> button. <br> New waypoint will be inserted after the active one.  </b> <br> <br> Click on the next button to continue.',
            elementID: ['waypoint-label','insert-btn'],
        },
        {   
            id: 8,
            title: 'Inserting other makers',
            text: 'To insert other markers (e.g. circle, anchor, pin) simply <b>select</b> the desired marker <b>icon in the side panel</b>, (in case of a circle, adjust it\'s radius above,where the speed box was located), type in a <b>name of the marker</b> in the input field and <b>click on the map.</b> <br> To <b><span style="color:red;">Delete</span></b> a marker click on it on the map and then click <b>delete</b> in the dialog box <br> <br> Click on the next button to continue.',
            elementID: ['.icons-row'],
        },
        {   
            id: 9,
            title: 'Navigation and info bar',
            text: 'In the navbar you can navigate back to routes page and you will <b>lose any unsaved changes!</b>. <br> You are also presented with the information about the route and the options to see the tutorial again or to log in/log out. <br> <br> Click on the next button to continue.',
            elementID: ['header'],
        },
        {   
            id: 10,
            title: 'Changing map style',
            text: 'To change the map style press the <b>Pallete button</b> in the left bottom corner of the map. <br> <br> Click on the next button to continue.',
            elementID: ['map-style-btn'],
        },
        {   
            id: 11,
            title: 'Naming and saving the route',
            text: 'Type in the name of the route in the input field and press <b>Save button</b> to save the route. <br> <br> Note: Saving a route that has been edited will save it as a <b>new copy</b>. <br> <br> Click on the Finish button to complete the tutorial!',
            elementID: ['save-row'],
        }
        
    ]
})


export const mutations = {
    toggleTutorial(state) {
        state.tutorialVisible = !state.tutorialVisible;
    },
    setTutorialVisibility(state, value) {
        state.tutorialVisible = value;
    },
    toggleLogged(state) {
        state.isLoggedIn = !state.isLoggedIn;
    },
}

// ako zelis samo citati vrijednost isLoggedIn onda
// this.$store.state.isLoggedIn

// ako zelis mijenjati vrijednost isLoggedIn onda
// this.$store.commit('toggleLogged')