# web/controllers/analysis_controller.ex
defmodule VisualizeServerWeb.AnalysisController do
  # Webのcontrollerモジュールを使用できるようにする(おまじないのようなもの)
  use VisualizeServerWeb, :controller

  # indexアクション
  #  conn - リクエスト情報を保持
  #  params - クエリストリングやフォーム入力などのパラメータ
  def index(conn, _params) do
    # index.html.eexテンプレートを表示する
    render conn, "index.html"
  end
end
