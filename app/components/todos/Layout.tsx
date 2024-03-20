"use client";

// * basic
import { useState, useEffect } from "react";

// * install libraries
import { InputText } from "primereact/inputtext";
import _ from "lodash";
import moment from "moment";
import "moment/locale/ko";
import axios from "@/app/utils/axios-instance";

const TodosLayout = (props: any) => {
    const { todos } = props;
    const [data, setData] = useState<any>();
    const [value, setValue] = useState();

    useEffect(() => {
        setData(todos);
    }, []);

    // 일정 생성
    const createTodo = () => {
        axios.post("/todos", { title: value }).then((res) => {
            setValue();
            setData((prev: any) => {
                return [...prev, res.data.data];
            });
        });
    };

    // 일정 삭제
    const deleteTodo = (id: string) => {
        axios.delete(`/todos/${id}`).then((res) => {
            setData((prev: any) => {
                return _.filter(prev, (item: any) => {
                    return id !== item.id;
                });
            });
        });
    };

    // 일정 수정(isDone)
    const modifyTodo = (id: string, isDone: boolean, title: string) => {
        axios
            .post(`/todos/${id}`, {
                title: title,
                isDone: !isDone,
            })
            .then((res) => {
                setData((prev: any) => {
                    return _.map(prev, (item: any) => {
                        if (id == item.id) {
                            return { ...item, isDone: !item.isDone };
                        } else {
                            return item;
                        }
                    });
                });
            });
    };

    return (
        <div className='w-1/2 h-screen mx-auto flex flex-col gap-4 justify-center'>
            <div className='h-96 ring-1 px-4 py-2 flex flex-col gap-4 overflow-y-auto'>
                {/* todo 보여주는 곳 */}
                {_.map(data, (todo: any) => {
                    return (
                        <div key={todo.id} className='flex gap-3 text-center'>
                            {/* title */}
                            <h1
                                className='w-24 whitespace-nowrap truncate'
                                title={todo.title}
                            >
                                {todo.title || "제목없음"}
                            </h1>
                            <p className='grow'>
                                {moment(todo.created_at).format("llll")}
                            </p>
                            <input
                                type='checkbox'
                                onChange={() => {
                                    modifyTodo(
                                        todo.id,
                                        todo.isDone,
                                        todo.title
                                    );
                                }}
                                checked={todo.isDone}
                                className='w-5 h-5 m-auto'
                            />
                            <button
                                className='text-lg px-2 inline-block align-middle'
                                onClick={() => {
                                    deleteTodo(todo.id);
                                }}
                            >
                                x
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* 일정 생성 */}
            <div className='flex flex-col gap-4'>
                <InputText
                    value={value}
                    onChange={(e: any) => {
                        setValue(e.target.value);
                    }}
                />
                {/* 생성 버튼 */}
                <button
                    onClick={createTodo}
                    className='p-2 bg-gray-300 rounded-xl shadow-lg'
                >
                    일정 생성하기
                </button>
            </div>
        </div>
    );
};

export default TodosLayout;
