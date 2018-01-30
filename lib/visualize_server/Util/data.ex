#file   data.ex
#author mi-na
#date   18/01/30

defmodule Util.Data do

  def readFlowDataJson data_name, number_str do
    {:ok, json_str} = File.read getAbsPath(data_name, String.to_integer(number_str))
    {:ok, map_data} = Poison.decode json_str
    map_data
  end

  defp getAbsPath data_name, number do
    subdir_name = Integer.to_string div(number, 100)
    file_name = Integer.to_string number
    "data/" <> data_name <> "/" <> subdir_name <> "/" <> file_name
  end

end # Util.IO
