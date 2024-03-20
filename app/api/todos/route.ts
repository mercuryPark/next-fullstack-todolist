import { NextResponse, NextRequest } from "next/server";
import dummyTodos from "../../data/dummy.json";
import { fetchTodos, addATodos } from "../../data/firestore";

// 할일 모두 조회
export async function GET(request: NextRequest) {
    const fetchedTodos = await fetchTodos();

    console.log(fetchedTodos);

    const response = {
        message: "todos 몽땅 가져오기",
        data: fetchedTodos,
    };

    return NextResponse.json(response, { status: 200 });
    // return "오늘도 빡코딩";
}

// 할일 추가
export async function POST(request: NextRequest) {
    const { title } = await request.json();

    const addedTodo = await addATodos({ title });

    const response = {
        message: "할일 추가 성공!",
        data: addedTodo,
    };

    return NextResponse.json(response, { status: 201 });
}
