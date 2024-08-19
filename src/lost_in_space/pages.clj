(ns lost-in-space.pages
  (:require
    [powerpack.ingest :as ingest]
    [powerpack.markdown :as md]))

(defmethod ingest/parse-file :html [db file-name file]
  [{:page/uri (ingest/suggest-url nil file-name)
    :page/body (slurp file)}])

(defn add-page-kind [file-name transactions]
  (let [kind (->> file-name
               (re-find #"\.([^.]+)$")
               second
               keyword)]
    (for [tx transactions]
      (cond-> tx
        (and (:page/uri tx) (not (:page/kind tx)) kind)
        (assoc :page/kind kind)))))

(defn render [context page]
  (case (:page/kind page)
    :html
    [:html
     [:head]
     (:page/body page)]

    :md
    [:html
     [:head]
     [:body
      (md/render-html (:page/body page))]]))
