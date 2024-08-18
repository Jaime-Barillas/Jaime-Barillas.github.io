(ns lost-in-space.dev
  (:require
    [lost-in-space.core :as blog]
    [powerpack.dev :as dev]))

(defmethod dev/configure! :default []
  blog/config)

(comment
  (dev/start)
  (dev/stop)
  (dev/reset)
  (dev/get-app))

