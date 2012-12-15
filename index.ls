<- $
lyvote.render do
  /* optional argument */
  cx: 600
  cy: 500                            # chart center coordinate
  transform: "scale(0.8)"            # chart transformation
  #seat-count:  [12 16 18 22 24 21]  # seat count in each row, totally 6 rows. auto-gen if not provided
  seat-mapping: lyvote.map.linear

  /* required argument */
  namelist: "voter.json"             # e.g., mly-8.json
  node: \#nuke                       # tag selector in string

