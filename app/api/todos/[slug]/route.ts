import { NextResponse, NextRequest } from "next/server";
import { fetchATodo, deleteATodo, editATodo } from "@/app/data/firestore";

// 할 일 단일 조회
export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    const searchParams = request.nextUrl.searchParams;

    const search = searchParams.get("search");

    const fetchedTodo = await fetchATodo(params.slug);

    if (fetchedTodo === null) {
        return new NextResponse(null, { status: 204 });
    }

    const response = {
        message: "단일 할일 가져오기 성공",
        data: fetchedTodo,
    };

    return NextResponse.json(response, { status: 200 });
    // return "오늘도 빡코딩";
}

// 할 일 단일 삭제
export async function DELETE(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    const deletedTodo = await deleteATodo(params.slug);

    if (deletedTodo === null) {
        return new NextResponse(null, { status: 204 });
    }

    const response = {
        message: "단일 할일 삭제 성공",
        data: deletedTodo,
    };

    return NextResponse.json(response, { status: 200 });
    // return "오늘도 빡코딩";
}

// 할 일 단일 수정 id
export async function POST(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    const { title, isDone } = await request.json();

    if (title === null || title === "" || title === undefined) {
        const errMessage = {
            message: "title을 작성해주세요.",
        };
        return NextResponse.json(errMessage, { status: 422 });
    }

    const editedTodo = await editATodo(params.slug, { title, isDone });

    const response = {
        message: "단일 할일 수정 성공",
        data: editedTodo,
    };

    return NextResponse.json(response, { status: 200 });
    // return "오늘도 빡코딩";
}
