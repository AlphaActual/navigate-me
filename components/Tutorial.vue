<template>
    <!-- Modal -->
    <div v-if="$store.state.tutorialVisible" class="tutorial-content">
        <div>
            <div class="tutorial-content__header d-flex justify-content-between"> 
                <h5 class="tutorial-content__title" v-html="currentSlide.title"></h5> 
                <button @click="closeModal" type="button" class="btn-close"></button>
            </div>
            <hr>
            <div class="tutorial-content__body" v-html="currentSlide.text">
               
            </div>
        </div>
        <div class="tutorial-content__buttons">
            <button v-if="this.currentSlide.id !== this.slides[0].id" @click="prevSlide" type="button" class="btn">Prev</button>
            <button v-if="this.currentSlide.id !== this.slides[this.slides.length -1].id" @click="nextSlide" type="button" class="btn">Next</button>
            <button v-if="this.currentSlide.id === this.slides[this.slides.length -1].id" @click="closeModal" type="button" class="btn">Finish</button>
        </div>
    </div>
</template>

<script>

export default {
    name: 'Tutorial',
    data() {
        return {
            currentSlide: {},
            slides: [
                {   
                    id: 0,   
                    title: 'Welcome to the Route Planner',
                    text: 'Here you can create your route and save it to your profile for later use. <br> You can also load your saved routes and edit them.',
                    elementID: null,
                },
                {   
                    id: 1,
                    title: 'Creating a Route',
                    text: 'Slide 2',
                    elementID: 'save-btn'
                },
                {   
                    id: 2,
                    title: 'Creating a Route',
                    text: 'here you type the name of the route',
                    elementID: 'name-input'
                },
                {   
                    id: 3,
                    title: 'Moving a waypoint',
                    text: 'Click on waypoint and then clikt on the new position',
                    elementID: 'map-wrap'
                },
                {   
                    id: 4,
                    title: 'Creating a Route',
                    text: 'Here is speed input',
                    button: 'Finish!',
                    elementID: 'speed-input'
                }
            ]
        }
    },
    mounted() {
        this.currentSlide = this.slides[0];
    },
    methods: {
        nextSlide() {
            let index = this.currentSlide.id;
            if (index < this.slides.length - 1) {
                this.currentSlide = this.slides[index + 1];
            }
            // this.removeClonedElement();
            // this.duplicateElement(this.currentSlide.elementID);
            this.removeHighlight();
            this.addHighlight();
        },
        prevSlide() {
            let index = this.currentSlide.id;
            if (index > 0) {
                this.currentSlide = this.slides[index - 1];
            }
            // this.removeClonedElement();
            // this.duplicateElement(this.currentSlide.elementID);
            this.removeHighlight();
            this.addHighlight();
        },
        closeModal() {
            this.removeClonedElement();
            this.currentSlide = this.slides[0];
            this.$store.commit('toggleTutorial');
        },
        duplicateElement(elementID) {
            if (!elementID) {
                return;
            }
            // Step 1: Select the original element
            const originalElement = document.getElementById(elementID);

            // Step 2: Create a copy of the element
            const clonedElement = originalElement.cloneNode(true);

            // Step 3: Set the cloned element's position to absolute
            clonedElement.style.position = 'absolute';
            clonedElement.style.zIndex = '10000';
            clonedElement.classList.add('cloned');
            clonedElement.classList.add('heighlight');

            // Step 4: Retrieve position and dimensions of the original element relative to the document
            const originalRect = originalElement.getBoundingClientRect();
            const originalOffsetTop = originalRect.top + window.scrollY;
            const originalOffsetLeft = originalRect.left + window.scrollX;
            const originalOffsetWidth = originalRect.width;
            const originalOffsetHeight = originalRect.height;

            // Step 5: Set position and dimensions of the cloned element relative to the document
            clonedElement.style.top = `${originalOffsetTop}px`;
            clonedElement.style.left = `${originalOffsetLeft}px`;
            clonedElement.style.width = `${originalOffsetWidth}px`;
            clonedElement.style.height = `${originalOffsetHeight}px`;

            // Step 6: Append the cloned element to the document body or a container
            document.body.appendChild(clonedElement);
        },
        removeClonedElement() {
            const clonedElement = document.querySelector('.cloned');
            if (clonedElement) {
                clonedElement.remove();
            }
        },
        addHighlight(){
            document.getElementById(this.currentSlide.elementID).classList.add('heighlight');
        },
        removeHighlight(){
            document.getElementById(this.currentSlide.elementID).classList.remove('heighlight');
        }
    }
}
</script>

<style scoped>
.tutorial-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 11000;
    background-color: #fff;
    padding: 20px;
    width: 600px;
    height: 300px;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
}
.tutorial-content__title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
}
.tutorial-content__buttons {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}
</style>