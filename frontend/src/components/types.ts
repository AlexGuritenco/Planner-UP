export interface Task {
    id: number;
    title: string;
    description: string;
    due: string;
    done?: boolean | undefined;
}