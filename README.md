# cyber-server
server for Cyber2D game

## API Endpoint
### Authentication

##### Register : `/register` method:`POST`
    {
        mail: example@gmail.com,
        name: userName,
        password: X1xxxx*
    }
##### Login : `/login` method:`POST`
    {
        mail: example@gmail.com,
        password: X1xxxx*
    }
##### Logout : `/logout` method: `DELETE`

### Player data 

##### Create Player Data : `/add` method: `PUT`
     {
        playerId: player_id,
        score: 6xx,
        level: 1-x,
        cybr_coin_amount: 0-x,
        cybr_coin_per_level: {level1:0-x,...},
        best_time: 0-x
    }
##### GET Player Data : `/get/:id` method: `GET`
Returning :

    {
        playerId: player_id,
        score: 6xx,
        level: 1-x,
        cybr_coin_amount: 0-x,
        cybr_coin_per_level: {level1:0-x,...},
        best_time: 0-x
    }

##### Update Player Data : `/patch` method: `PATCH`
     {
        playerId: player_id,
        score: 6xx,
        level: 1-x,
        cybr_coin_amount: 0-x,
        cybr_coin_per_level: {level1:0-x,...},
        best_time: 0-x
    }
##### Remove Player Data : `/delete` method: `DELETE`
     {
        playerId: player_id,
     }
