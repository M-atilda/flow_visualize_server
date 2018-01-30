#file   room_channel.ex
#author mi-na
#date   18/01/30

defmodule VisualizeServerWeb.RoomChannel do
  use Phoenix.Channel

  def join("room:lobby", auth_msg, socket) do
    {:ok, socket}
  end
  def join("room:" <> _private_room_id, _auth_msg, socket) do
    {:error, %{reason: "unauthorized"}}
  end

  #NOTE: data is passed as map object
  def handle_in("start", _data, socket) do
    IO.puts "[Info] start rendering."
    data = Util.Data.readFlowDataJson "sample", "10"
    broadcast! socket, "data", %{flow_data: data}
    {:noreply, socket}
  end

end
