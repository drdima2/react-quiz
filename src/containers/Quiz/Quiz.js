import React from "react";
import classes from './Quiz.module.css'
import ActiveQuiz from "../../components/ActiveQuiz/ActiveQuiz";
import FinishedQuiz from "../../components/FinishedQuiz/FinishedQuiz";
import axios from "../../axios/axios-quiz";
import Loader from "../../components/UI/Loader/Loader";

class Quiz extends React.Component{

    state={
        results: {}, //  { [id]:  success, error   }
        isFinished: false,
        activeQuestion: 0,
        answerState: null, //{ [ id: 'success' or 'error' ] }
        quiz: [],
        loading: true
    }


    onAnswerClickHandler = (answerId) =>{
        if (this.state.answerState){
            const key = Object.keys(this.state.answerState)[0]
            if (this.state.answerState[key]==='success'){
                return
            }
        }

        const question = this.state.quiz[this.state.activeQuestion]
        const results = this.state.results

        if (question.rightAnswerId===answerId){
            if (!results[question.id]){
                results[question.id] = 'success'
            }
            this.setState({
                answerState: { [answerId]: 'success' },
                results
            })

            const timeout = window.setTimeout(()=>{
                if (this.isQuizFinished()){
                    this.setState({
                        isFinished: true
                    })
                }else{
                    this.setState({
                        activeQuestion: this.state.activeQuestion+1,
                        answerState: null
                    })
                }
                window.clearTimeout(timeout);
            }, 1000)


        }else {
            results[question.id] = 'error';
            this.setState({
                answerState: { [answerId]: 'error' },
                results
            })
        }


    }

    isQuizFinished(){
        return this.state.activeQuestion+1===this.state.quiz.length
    }

    retryHandler=()=>{
       this.setState({
           activeQuestion: 0,
           answerState: null,
           isFinished: false,
           results: {}
       })

    }

    async componentDidMount() {
        const quizId = this.props.match.params.id
        try{
            const response = await axios.get(`/quizes/${quizId}.json`)
            const quiz = response.data
            this.setState({
                quiz,
                loading: false
            })
        } catch (e) {
            console.log(e)
        }


        //console.log('Quiz Id=',this.props.match.params.id)


        //const quizes = [];
    }

    render() {
        const activeQuestion = this.state.activeQuestion;
        return(
            <div className={classes.Quiz}>

                <div className={classes.QuizWrapper}>
                    <h1>Please answer to all questions</h1>
                    {
                        this.state.loading ? <Loader/>
                            :


                                this.state.isFinished
                                    ? <FinishedQuiz
                                        results={this.state.results}
                                        quiz={this.state.quiz}
                                        onRetry={this.retryHandler}
                                    />
                                    : <ActiveQuiz
                                        answers={this.state.quiz[activeQuestion].answers}
                                        question={this.state.quiz[activeQuestion].question}
                                        onAnswerClick={this.onAnswerClickHandler}
                                        quizLenght={this.state.quiz.length}
                                        answerNumber={this.state.activeQuestion + 1}
                                        state={this.state.answerState}
                                    />

                    }

                </div>

            </div>
        )
    }
}

export default Quiz