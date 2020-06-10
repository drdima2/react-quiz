import React, {Component} from 'react';
import classes from './QuizList.module.css'
import {NavLink} from "react-router-dom";
import axios from "../../axios/axios-quiz";
import Loader from "../../components/UI/Loader/Loader";

class QuizList extends Component {


    state = {
        quizes: [],
        loading: true
    }


    renderQuizes() {
        return this.state.quizes.map((quiz, index)=>{
            return(
                <li key={quiz.id}
                >
                    <NavLink to={'/quiz/' + quiz.id}>
                        {quiz.name}
                    </NavLink>
                </li>
            )
        })
    }

    async componentDidMount() {
        try{
            const response = await axios.get('/quizes.json')
            const quizes = [];
            Object.keys(response.data).forEach((key, index) => {
                quizes.push({
                    id: key,
                    name: `Test N${index+1}`
                })
            })
            this.setState({
                quizes,
                loading: false
            })
        } catch (e) {
            console.log(e)
        }
        

    }

    render() {
        return (
            <div className={classes.QuizList}>
                <div>
                    <h1>Quiz List</h1>

                    {
                        this.state.loading
                        ? <Loader/>
                        : <ul>
                            {this.renderQuizes()}
                          </ul>
                    }

                </div>
            </div>
        );
    }


}



export default QuizList;
