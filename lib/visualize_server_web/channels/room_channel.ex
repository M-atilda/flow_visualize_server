defmodule VisualizeServerWeb.RoomChannel do
  use Phoenix.Channel

  def join("room:lobby", auth_msg, socket) do
    {:ok, socket}
  end
  def join("room:" <> _private_room_id, _auth_msg, socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in("start", _data, socket) do
    IO.puts "[Info] start renering."
    broadcast! socket, "data", %{msg: "hello"}
    {:noreply, socket}
  end

  # def handle_in("move", %{"x" => x, "y" => y}, socket) do
  #   broadcast! socket, "move", %{x: x, y: y}
  #   {:noreply, socket}
  # end
end
