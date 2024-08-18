(ns lost-in-space.export
  (:require
    [lost-in-space.core :as blog]
    [powerpack.export :as export]))

(defn ^:export export! [& args]
  (-> blog/config
    (assoc :site/base-url "https://lost-in-space.xyz")
    (export/export!)))
