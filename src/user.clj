(ns user
  (:require
    [lost-in-space.site :as site]
    [powerpack.dev :as dev]))

(defmethod dev/configure! :default []
  site/config)

(comment
  (dev/start)
  (dev/stop)
  (dev/reset)
  (dev/get-app))

