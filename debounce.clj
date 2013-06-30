(defn debounce 
  ([c ms] (debounce (chan) c ms))
  ([c' c ms]
    (go
      (loop [start nil loc (<! c)]
        (if (nil? start)
          (do
            (>! c' loc)
            (recur (js/Date.) nil))
          (let [loc (<! c)]
            (if (>= (- (js/Date.) start) ms)
              (recur nil loc)
              (recur (js/Date.) loc))))))
    c'))