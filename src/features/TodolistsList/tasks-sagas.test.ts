import {call, put} from "redux-saga/effects";
import {setAppErrorAC, setAppStatusAC} from "../../app/app-reducer";
import {addTaskWorkerSaga, fetchTasksWorkerSaga} from "./tasks-sagas";
import {GetTasksResponse, TaskPriorities, TaskStatuses, todolistsAPI} from "../../api/todolists-api";
import {setTasksAC} from "./tasks-reducer";

beforeEach(()=>{

})

test("fetchTasksWorkerSaga work", ()=>{
    const gen = fetchTasksWorkerSaga({type: "TASKS/FETCH-TASKS", todolistId: "1"})
    expect(gen.next().value).toEqual(put(setAppStatusAC("loading")))
    expect(gen.next().value).toEqual(call(todolistsAPI.getTasks, "1"))

    const fakeResponse: GetTasksResponse = {
        error: "",
        totalCount: 1,
        items: [ { id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },]
    }
    expect(gen.next(fakeResponse).value).toEqual(put(setTasksAC(fakeResponse.items, "1")))
    let actual = gen.next();
    expect(actual.value).toEqual(put(setAppStatusAC('succeeded')))
    expect(actual.done).toBeTruthy()
})

test("addTaskWorckerSaga error flow work", ()=>{
    let title = "title";
    let todolistId = "10";

    const gen = addTaskWorkerSaga({type: "TASKS/ADD-TASK", title: title, todolistId: todolistId})
    expect(gen.next().value).toEqual(put(setAppStatusAC("loading")))
    expect(gen.next().value).toEqual(call(todolistsAPI.createTask, todolistId, title))
    expect(gen.throw({message: "some error"}).value).toEqual(put(setAppErrorAC("some error")))
    expect(gen.next().value).toEqual(put(setAppStatusAC('failed')))
})