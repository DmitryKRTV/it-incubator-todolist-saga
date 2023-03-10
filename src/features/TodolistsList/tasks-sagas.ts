import {call, put, takeEvery} from "redux-saga/effects";
import {SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from "../../app/app-reducer";
import {AxiosResponse} from "axios";
import {GetTasksResponse, ResponseType, todolistsAPI} from "../../api/todolists-api";
import {addTaskAC, removeTaskAC, setTasksAC} from "./tasks-reducer";
import {Dispatch} from "redux";
import {
    handleServerAppError,
    handleServerAppErrorSaga,
    handleServerNetworkError,
    handleServerNetworkErrorSaga
} from "../../utils/error-utils";

export function* fetchTasksWorkerSaga(action: ReturnType<typeof fetchTasks>) {
    yield put(setAppStatusAC('loading'))
    const data: GetTasksResponse = yield call(todolistsAPI.getTasks, action.todolistId)
    yield put(setTasksAC(data.items, action.todolistId))
    yield put(setAppStatusAC('succeeded'))
}

export function* removeTaskWorkerSata(action: ReturnType<typeof removeTask>) {
    const res: AxiosResponse<ResponseType> = yield call(todolistsAPI.deleteTask, action.todolistId, action.taskId)
    yield put(removeTaskAC(action.taskId, action.todolistId))
}

export function* addTaskWorkerSaga(action: ReturnType<typeof addTask>) {
    yield put(setAppStatusAC('loading'))
    try {
        const res = yield call(todolistsAPI.createTask, action.todolistId, action.title)
        if (res.data.resultCode === 0) {
            const task = res.data.data.item
            yield put((addTaskAC(task)))
            yield put((setAppStatusAC('succeeded')))
        } else {
            yield* handleServerAppErrorSaga(res.data);
        }
    } catch (err) {
        yield* handleServerNetworkErrorSaga(err)
    }

}

export const fetchTasks = (todolistId: string) => ({type: "TASKS/FETCH-TASKS", todolistId})
export const removeTask = (taskId: string, todolistId: string) => ({type: "TASKS/REMOVE-TASK", taskId, todolistId})
export const addTask = (title: string, todolistId: string) => ({type: "TASKS/ADD-TASK", title, todolistId} as const)

export function* tasksWatcherSaga() {
    yield takeEvery("TASKS/FETCH-TASKS", fetchTasksWorkerSaga)
    yield takeEvery("TASKS/REMOVE-TASK", removeTaskWorkerSata)
    yield takeEvery("TASKS/ADD-TASK", addTaskWorkerSaga)
}

// export const addTaskTC = (title: string, todolistId: string) => (dispatch: Dispatch<ActionsType | SetAppErrorActionType | SetAppStatusActionType>) => {
//     dispatch(setAppStatusAC('loading'))
//     todolistsAPI.createTask(todolistId, title)
//         .then(res => {
//             if (res.data.resultCode === 0) {
//                 const task = res.data.data.item
//                 const action = addTaskAC(task)
//                 dispatch(action)
//                 dispatch(setAppStatusAC('succeeded'))
//             } else {
//                 handleServerAppError(res.data, dispatch);
//             }
//         })
//         .catch((error) => {
//             handleServerNetworkError(error, dispatch)
//         })
// }