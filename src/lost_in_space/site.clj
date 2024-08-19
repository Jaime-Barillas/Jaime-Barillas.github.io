(ns lost-in-space.site
  (:require
    [powerpack.export :as export]
    [lost-in-space.pages :as pages]))

(def config
  {:site/title "lost-in-space"
   :site/base-url "https://lost-in-space.xyz"

   :powerpack/content-dir "resources/public"
   :powerpack/content-file-suffixes ["md" "html"]
   :powerpack/render-page #'pages/render
   :powerpack/create-ingest-tx #'pages/add-page-kind

   :optimus/assets [{:public-dir "public"
                      :paths [#"/images/.+\.png"]}]
   :optimus/bundles {"styles.css"
                      {:public-dir "public"
                       :paths [#"/css/.+\.css"]}}})

(defn export! [opts] (export/export! config))

