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
  def handle_in("data", %{"name" => data_name, "time" => ite_times_str}, socket) do
    IO.puts "[Info] start rendering. (#{data_name}:#{ite_times_str})"
    data = Util.Data.readFlowDataJson data_name, ite_times_str
    #TODO: uni-cast
    broadcast! socket, "data", %{flow_data: data}
    IO.puts "[Info] sent data."
    {:noreply, socket}
  end

end
