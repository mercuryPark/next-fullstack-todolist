// * install libraries
import axios from "@/app/utils/axios-instance";
import _ from "lodash";
import moment from "moment";

// * components
import TodosLayout from "@/app/components/todos/Layout";

const TodosPage = async () => {
    const todos = await axios.get("/todos");

    return <TodosLayout todos={todos.data.data} />;
};

export default TodosPage;
