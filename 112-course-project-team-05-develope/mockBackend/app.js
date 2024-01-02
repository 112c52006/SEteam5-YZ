const express = require('express')   //導入框架
const cors = require('cors')
const app = express()  //宣告框架變數
const port = 1000  //定義本地伺服端port 

app.use(express.json())
app.use(cors())

app.listen(port, () => {        //伺服器運行的Function
    console.log(`Server listening at http://localhost:${port}`)  //運作提示字樣
})

app.post('/trello/createRepo', async (req, res) =>{
    console.log(req.body)
    let result = {
        success: false
    }
    res.json(result)
})

module.exports = app