

class Chat extends React.Component {
    constructor(props) {
        super(props);

        const user = this.props.user ? this.props.user : "anonimo"; 

        var showChat = false;

        this.state = {
            messages: [/* {
                id: 0,
                text: 'Hola',
                time: Date.now(),
                user: this.getUserSession()
            },
            {
                id: 1,
                text: 'HolDSASAa',
                time: Date.now(),
                user: this.getUserSession()
            },
            {
                id: 2,
                text: 'saASDHola',
                time: Date.now(),
                user: this.getUserSession()
            } */],
            message: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this); 
        this.toggleChat = this.toggleChat.bind(this);
    }
    componentDidMount() {
        $("#main-chat").hide();
       firebase.database().ref('messages/').on('value', snap => {
           const currentMessages = snap.val();
           if(currentMessages != null) {
               this.setState({
                   messages: currentMessages
               });
               
           this.scrollDown("#messageList"); //Hacer scroll de  los mensajes cada vez que se actualice
           }
       });
    }

    handleChange(event) {
        this.setState({message: event.target.value});

    }

    handleSubmit(event) {
        this.sendMessage();
        event.preventDefault();
    }



    sendMessage() {
        const list = this.state.messages;
        const newMessage = {
            id: this.state.messages.length,
            user: this.getUserSession(),
            text: this.state.message,
            time: Date.now()
        }
        firebase.database().ref('messages/' + newMessage.id)
            .set(newMessage)
        this.setState({
            message: ''
        })
    }

    getUserSession() {
        return "lolo"
    }
    //@param element is a html selector
    scrollDown(element) {
        const jElement = $(element)
        const jsELement = document.querySelector(element)
        jElement.animate({scrollTop: jsELement.scrollHeight + "px"}, 500)
    }

    checkHTMLSelector(element) {
        if(document.querySelector(element) != null) {
            return 1;
        }
        return 0;
    }

    buildDate(timestamp) {
        const month = {
            0: "Enero",
            1: "Febrero",
            2: "Marzo",
            3: "Abril",
            4: "Mayo",
            5: "Julio",
            6: "Julio",
            7: "Agosto",
            8: "Septiembre",
            9: "Octubre",
            10: "Noviembre",
            11: "Diciembre",
        }
        const date = new Date(timestamp);
        const today = new Date();
        if(date.getDate() == today.getDate() & date.getMonth() == today.getMonth() & date.getFullYear() == today.getFullYear()) {
            return "Hoy a las " + date.getHours() + ":" + date.getSeconds();
        }
        
        return date.getDate() + " de " + month[date.getMonth()];
        
    }

    toggleChat() {
        $("#main-chat").toggle(400, () => {
            this.showChat = !this.showChat;
            /*
                Cuando se muestre el chat se hará un scroll
                para llegar al final de los mensajes
            */
           this.scrollDown("#messageList"); 
        })
        $(".chat-min").toggle(400)
    }

    render() {
        
        const { messages } = this.state;
        const messageList = messages.map(message => {
            const date = this.buildDate(message.time)
        const classMessage = this.getUserSession() == message.user ? "my-message" : "other-message  " ;
        const alignRight = this.getUserSession() == message.user ? "" : "align-right" 
        return (
            <li key={message.id}>
                <div className={"message-data " + alignRight}>
                
                <span className="message-data-name">
                    {message.user}
                </span>
                <span className={"message-data-time" }>{date} </span>
                </div>
                <div className={"message mx-2 " + classMessage}>
                    {message.text}
                </div>
            </li>

        )
        
        })
        return (
           <div className="main">
                <button className="chat-min" onClick={this.toggleChat}><i className="fas fa-comment-dots"></i></button>
                <div id="main-chat">
                    <div className="chat container-fluid p-0">
                    <div className="header-chat container-fluid p-2">
                        <h1>Chat - MundoCripto</h1><i id="closed-icon-chat" className="fas fa-times-circle" onClick={this.toggleChat}></i>
                    </div>
                    <ul className="messageList chat-history container-fluid" id="messageList">
                            {messageList}
                    </ul>
                <form onSubmit={this.handleSubmit} className="sendMessage container-fluid mb-2">
                    <input type="text" onChange={this.handleChange} value={this.state.message} id="text" placeholder="Escribe un mensaje"/>
                    <button type="submit" id="button" onClick={this.handleSubmit}><i className="fab fa-telegram-plane"></i></button>
                </form>
                </div>
                </div>
           </div>
        )
    
    }
}
function App() {
    return (
        <div>
            <Chat />
        </div>
    )
}

ReactDOM.render(
    <App />,
    document.getElementById("root")
)