import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/useToast";
import { addTodo } from "@/api/todos";

type FormData = {
  title: string;
};

export function AddTodo({ onAdd }: { onAdd: () => void }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    if (!data.title.trim()) return;

    try {
      setLoading(true);
      await addTodo(data.title);
      reset();
      onAdd();
      toast({
        title: "Success",
        description: "Todo added successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add todo",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 mb-6">
      <Input
        placeholder="Add a new todo..."
        {...register("title")}
        disabled={loading}
        className="flex-1"
      />
      <Button type="submit" disabled={loading}>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </>
        )}
      </Button>
    </form>
  );
}