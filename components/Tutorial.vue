<template>
    <!-- Modal -->
    <div  class="tutorial-content">
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
    props: {
        slides: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            currentSlide: {}
        }
    },
    mounted() {
        this.currentSlide = this.slides[0];
        
    },
    methods: {
        nextSlide() {
            this.removeHighlight();
            let index = this.currentSlide.id;
            if (index < this.slides.length - 1) {
                this.currentSlide = this.slides[index + 1];
            }
            this.addHighlight();
        },
        prevSlide() {
            this.removeHighlight();
            let index = this.currentSlide.id;
            if (index > 0) {
                this.currentSlide = this.slides[index - 1];
            }
            this.addHighlight();
        },
        closeModal() {
            this.removeHighlight();
            this.currentSlide = this.slides[0];
            this.$store.commit('toggleTutorial');
        },
        addHighlight(){
            if (!this.currentSlide.elementID) {
                return;
            }
            this.currentSlide.elementID.forEach(element => {
                // ako je element tipa class, dodaj svim elementima s tom klasom klasu heightlight
                if(element.includes('.')){
                    document.querySelectorAll(element).forEach(e => {
                        e.classList.add('heighlight');
                    });
                    return;
                }
                // ako je element tipa id, dodaj elementu s tim id-om klasu heightlight
                document.getElementById(element).classList.add('heighlight');
            });
        },
        removeHighlight(){
            if (!this.currentSlide.elementID) {
                return;
            }
            this.currentSlide.elementID.forEach(element => {
                // ako je element tipa class, makni svim elementima s tom klasom klasu heightlight
                if(element.includes('.')){
                    document.querySelectorAll(element).forEach(e => {
                        e.classList.remove('heighlight');
                    });
                    return;
                }
                // ako je element tipa id, ukloni elementu s tim id-om klasu heightlight
                document.getElementById(element).classList.remove('heighlight');
            });
        },
    }
}
</script>

<style scoped>
.tutorial-content {
    position: absolute;
    bottom: 20px;
    right: 20px;
    z-index: 11000;
    background-color: #fff;
    padding: 20px;
    width: 600px;
    height: max-content;
    min-height: 300px;
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