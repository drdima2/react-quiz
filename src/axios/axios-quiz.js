import axios from 'axios'

export default axios.create({
    baseURL: 'https://react-quiz-514a3.firebaseio.com/'
})