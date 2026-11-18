# papercut finish: paper-grain texture, gentle saturation, fine grain, soft vignette
GRADE="[0:v]format=gbrp[a];[1:v]format=gbrp,scale=1920:1080[pp];[a][pp]blend=all_mode=multiply:all_opacity=0.32[pa];[pa]format=yuv420p,eq=saturation=1.03,noise=alls=3:allf=t,vignette=PI/7[v]"
