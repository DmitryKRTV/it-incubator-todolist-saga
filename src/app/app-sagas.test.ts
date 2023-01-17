import {initializeAppSaga} from "./app-sagas";
import {authAPI, MeResponseType} from "../api/todolists-api";
import {call, put} from "redux-saga/effects";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {setAppInitializedAC} from "./app-reducer";

let fakeMeResponse :MeResponseType

beforeEach(()=>{
    fakeMeResponse = {resultCode: 0, data: {login: "", id:0, email: ""}, messages: []}
})

test("initializeAppWorckerSaga", ()=>{
    const gen = initializeAppSaga()
    let result = gen.next()
    expect(result.value).toEqual(call(authAPI.me))

    result = gen.next(fakeMeResponse)
    expect(result.value).toEqual(put(setIsLoggedInAC(true)))

    result = gen.next()
    expect(result.value).toEqual(put(setAppInitializedAC(true)))
})