const HILI_LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAYAAAAxU7r0AAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAAA1WElEQVR4nO292bMcR3an+bl7bJl3JRYSC8EVBEGCosQqscSSiiVSVdMjTY9M3WU9Y93TNi8zf9voYWQ2Zi2ppJF6JJVYpWItXIsokiBBAiAIEPtyl8yMCHc/8+ARuVxcbGSSmST8M0vEzURmZKSH+8+Pn+N+XIkIkUgk8kXRs76ASCTyzSCKSSQSmQpRTCKRyFSIYhKJRKZCFJNIJDIVophEIpGpEMUkEolMhSgmkUhkKkQxiUQiUyGKSSQSmQpRTCKRyFSIYhKJRKZCFJNIJDIVophEIpGpMOdi4iFmSIhEvhYks76AVivU8BU/9r+eG9E3+Vwkws07H7X9f8f6Mz3m1zKR1irx4e9IJDLXzNwyuWnPoG6tc7FHiXweYr358pg/y0T0zY8yf5cbiUQCauY5YO92EBsHvZFxvmj1jfVnasx8mHMrBFBCvOGR6aLGfXDR2p0W8ycmAtKIhwf0mJBETYncgNrqnL+ZODTvE2Io8EtivsREhfvcVo/xvyFUE6WYNG2j5RK5E0SPCc+YsCiI1sl0mH0pihv+aetwm62Hi5fXef/DU3Lu/BqXrmwggBMoB2Pvt+VXf72RucQ5wbnQy3gB62RohAjQH/Sh8Q+KtTO7zm8ys3fA4in7FWleoDRcutbjl79+XU6d/gRjUrIsY+/eB3jm6SNq7/3LGMA7QSMoA/Ogh5HZIeJwzmFM2pitUHtBRJGYICRawn8pCJ2Xs2A0vrboLCfWoekwF8OcLMuorEW04Y233pLzFy+gdMrCygrnz5/HOk9d17Lj5e+rIiHUjJmLYGQeUMpgEgOAFbDWk6QaDVRWSBPF5mDAYqcY/9BsLvYbzswl2dY1ymiyLKHXH3D6zKdok1IsLlE6z649e9FZyslTp7ly7Xpwl2hQRkdBiSBA7R2eoBFpqoe+NpMoPNDpFGz0q1B3lApefQU6TWd45d88Zm6ZaGOaCiGYLEWUpvaOyjoETZJ48ixDtMajcADOY4yOPUwEAJFRPTh/+Rpnzp4T5xwLCwvs27dPLS9kqGFdCY5YsTXKRDGZJrMXEx16krqu6fdLvPckeUEnyVFGs7a2Rpoa0iyjrmtRoLyKQZxIqANWwBiN9fDWO0fl+EcnuL6+BmjyPGf/2XPy8h+/oPIixQPO1mSJQukkVqApM/NhTllXeCDPM6x3iDI4hEFVcuXaGkV3EY9CtGGzXyKA0ZMrhyP3LnVdA3DhwiXeffddLl68SFF0WeguoZOEE6dO8tob70g7o8D7JiwcrdqpM3MxSZtxaysMWZZRO4vWmuXlReq6pqoq0tSgVBv6E5x3sWOJkGcptRVOfHJKautZ3bUbneWs9XrUzpN3Orx37P3hfKW8id44Z/HO3erUs2E8nn37l+eK2Q9zMDjxaKVRGKytSEwKCK4uSbQOWQicJUs0CjBKoSQOdOaZO63007iDaaJwHsQkVB6cdWTdBZxYlID4G2fJmiQb/j1LJibjbp2d21TxbSdvflUXeBfM3DIBhquB1bAGjldFPzFlWjNemDET271OW4FFgSiNoBGlcc3fHvDbtbw5WIXeioTnzqrxvFf1mVsmkW8m22fO24756M/mhluYHIotpTVnxnm8k5HIvHCHwjAcEs0Z0TKJfElstUhuns838gWYI+sk3s3IDIm5fW/JNs5XYC6tEoiWSSQyY+40H8v88/W98sjXjO2q2r1d/RS+iU76G0cqY1bJDXNM5mRYs5V7+25GvkRCMxE0ZW0RNJV1WOuxXhjufzS2WNOPzQfx3k88/6bim21cnHM3/F7vJ8PHtjkOyvorvso7I4pJ5EtDgKquSJIwmjZJjkoy0Am1gPUyISZa64m/x59/U9HNli5KqfB7RXBewiQ83YiHdWH9mvMIkOZpeF5Vc2WlRJ9J5AvS9qaTDX+4PCLN8MBGf4BJMtJUo1AopYYJi0JyIzP6rMjYKt9vNu2vVEoF9dAgNag0lOGFy2u8+tov5Nq1Nby3fOvZZ3nuyNMKBSbNbnXqr5xvvvRHvhq2iTB4wDXHTqcgSTXHPjwlx0+dlbr5P2BCOGaf+e+rRUSQ8cIT0EkoztOfXeLv/vs/yJmz5zBJQm09v37tdf7+n/5Zrm30Zz2B9waiZRKZAn7M3J6s4VUdMp/95Ge/lGMffkC3u4hzjld/Xcif/Q9/onavdIerwFtacfHef+OHOuG3KlAKV1tMMySsLbz1m3fEi6JYXMIpTXdlCdsvuXL1Gmv9HmmaspAnczPS+WbfqciXjL/pCtc2CpGkmjfeflc++fQMyuSgEzqLK/QHJX/z9/8oG5uD4eecc0MhuTeGOnp0FD1M8hTWGcGZz84jyqCTlI1en6p2VM5zbWMTL0KWz5ctEMUk8qXiBT7++CSiDEmasVmWbJYVXhusd3x27py0UYzxaMa4sHyjEQEbBnzjfqOQ1lahtUE86CTFZDlFp4NoxZXr16R0fq6m/UUxiQwNi7v3VugwvBnfZF4mAwxKwbW165g0IckzlE5QRgfnoSguXbockmIx6S+5U9/JPDWmz4UaLd9ri7EsaXLaKlCGqrJonVCVdbOdh6bfL8nMfDXf+bKTIl857ZBEjx234+Y2Qrux/ORJtRo5WMNeSJ7ae0yahAYhGtEKr8AkIaVimmXD07Th5Bt33/NjL89XY/pciAZDsFC0wgtkOQxc0BkvdphAzHuPUkJmElIdrJh5KoF5upbIDBnf6+5uevubZf9S4wEK5Udbvqrx8+vgH9hyDXfO194uGaGakm8LTsHWlEjhvxRKwtvmrfFGyySybaW8B7wVkSkzb+IW+YpR2xyjkEQ+D1FMIqgmxNseI5HPQxSTe55264fx4zfIFxH5yog+kwjImHgMw7zbr7kZfuRLvaDI15FomUQikakQxeQeR7wP1ojSYR94kWZD+HZTke2JjtrIVqKY3OMonQAa78NOiWDwoqjrGjePO95F5pYoJvc4AvQHFUprtEkpqxpBk6QpKHPbz0ciLVFM7mEEqBykRTac+ZrkKe2q/3shbWJkekQxucfRJohIWcPFy9eHa3V6pUUnepvp8n7LIxIJxNDwPY4An5y5JBcuXKAuB5w6XfDQg/vU7l2rd/T5dn/tSCSKyT2MB949dlJef+MtyrKkU2Rcv36dTz7ZI9/9g+fVrl07SU00XyN3Rqwn9zhvvPUmJAliDE4Zdtz/AJ9dvMiv33xLkhv8rzduGBWtkkhLFJOvPbf3YbSJhrwPWyV4CUOTj058Ir2qpPSWpOhQoxg4IVtc5vzla1zbrLZ8zzhRSCKTRDG5h/EKtE5QWuO1wSmNKI0XhfPSbJY1NjlNosM1cnOimNzjGGNuyLUqEjbHiqHhyN0QxSRyA0qpoaBEIndKjOZEhhtBteIRdttT90Z2+MjUiJZJBCAKSeQLE8XkHudWohGHOZG7IYrJPc7NrJDoM4ncLVFM7nGstRNRm/EoThzqRO6GKCaRSGQqRDGJRCJTIYpJJBKZClFMIpHIVIhiEolEpkIUk0gkMhWimEQikakQxeQbjgCiRsdI5MsiikkkEpkKUUwikchUiGISiUSmQhSTSCQyFaKYRCKRqRDFJBKJTIUoJpFIZCrMvZjcLEFPzLURicwXc59QWmsNIjcXD5F7fDOorb9+8rmoIMhtxnkUtPocM6lFpsnciwlsb4WEBgIoxb1tpGz98TcWRlt+7VHrydcjkWkw92IScpF6dMxJ+oXZKh5RTCLT5GshJm2VH6/84W+Jw5w7HOZopfHeY7TBe1CKuGNfZKrMvZgopVBss5dLKyZxmHOb56OXRsOd9nFPF1xkysx9NGe8wrfDHEHwzo08iZE7YnyYKBIdsJHpMleWieixLReUH62ZF40Tj/VQCYhXKKfRAkFaQud7bx4FUaCE5jhZHhBEwxhFXQtJ0g5vFFXt8Wxry0TmgLb6+/GbPvb6vDF7MQnRSloZETVZiK6qSJIMrTNe+fmveOXnSJIkhIixoMQDfqwxxeP4sa5rtNYhxM5ocy2lDKIUSZbhvB8OI1s/itY6Wi5fFSKI0oSuoWkLCjwaowxeFEppUAYnNaIVSZbOna9w9mIChOLTTeH40Bia/8myIlRsR5gjAVivqK3D2opukTXv1cPz3GtHwaNucsQUeC2AQZRHXLAAlWhQEq2SeaDx+wngm07ANsNQ0QrxgtYKh6Cb+UK9chDF5G5xzuF9qPyhhwWdGIwYrA29Z2gSrUlz7x2DdGx/NNogWhDROMLkNYdglG76wXmrkvc23nvEBCtS6zCUr70nSQTEYYxGKY0tB3PXEcy9mAyjOALeW7wHrB2GPJM0BUzz7nvv6AHTPL/ZEZFgOotGFGiSEM7RErrC4SAzMivC7GRFqjUeSMaUQlwYxkMQGGXMtueYNXMvJlrrRlAAb4JyK4/RGpOmlGU960ucKXciA+O+j4nZsOJJ1NwH9L7ZKIaRNTU+zUFAXI3CY5SgxGEQxDm8q0mMmbtQ7NyLifcevKAElBYEQbxD0HgnpGbeivSr5U48+62YjM/VCY7Y1u8SmSWqEZQQiGhidBKGNRpIjAIvGK3x1mKtpVt0cCKYOZorNPdiYozBeYvgSDBoo/AiWGuxtg4RiLkbPc4n40Livcd6R7fbnfFVRYBhtM17i9IpmVEsdTs4cRil8d6SZSlVOUB5x46VFYUXMPNT9+dWTNrYuvceEaGTZuy4b4XV1RXyPEWJ4HBo0XMSU5nN8XYMVwszEhPvPdZaamf5+JPTd3CWyJdF4yppaH0jHoNmeWmRy9c2MakJYpJ0sHhMkrC6skJm9Fx1o3MoJjcOW7TW1HXNoUOHeOzALgUhBhEi86NPzUPjnjcxactKjX2ufX781Gn54PjHqCQZzj/RxuBcEJw43f4rYEsRG2OGc03+/M/+VP1f//f/I3VdYZTi6uVLdLOUb3/rOVYWO3MlJDBHYtIWjB+WUFvtQ/ATwsrhJig6nLlpGMnP7GMrX/3xjhywSFjfJB6t9PC5FgEVfSazRgiTDEMj8GMdpOZ//V9+pN597wO5cuUKy8vL7Nm9S+174H4A+v0+nU5nNhe9DXMgJrerzOH/FYAKBT0uHuYedyDeSZBwGCkQj1aj5xqPljjTZB5pLc9UwRMHH1PwGJ0swQDWOpQ2dDr5jK9ykjkQkxvxqC0mnAdCRKcVkrZhjP4/cjNUM7BRQ2Funksst3kldJoeQZMlCYkevZ4ZM7FWZ16YSzEZMha61I1jCqCd9zmSlns7PHx7xmveuNckltvcMRzzhPqtgKy5Tc4HN0DSBCfqqiLNipld6la+VrVJbbHH1bhFIjoeb3KUmxwjc0TjLxmv5Ao/DDIoINGgvFBXFYgjTbO5GqN+7WpUa/6NhESHh+KePcrtjuomx6/f7b9HCMP6FgGq2uM8GKPIsmxmV3YrZl+b1OSfWtohza2Y/WXPC3InR1FbrBJ1Q4em8U1kpzkqmfSpSCPazbtvi9o6pA/nHN7b9rv4fEN/NXYdWz0/7XM/duKvx5LG1g4ZHau6wgBZqkmGZdqUnZuvpSRz4jNpxocSrDwtzXoFAEIo06s250NToONm+pw5or5K7uynN6HhZj1x+3wSjxaPwqFkq5C0xzEv4F1e4+gjjekuwRGsZNI+Gluasv13jd33yWkwHq88WvkmJ04QTuc9RZ5jBZImzafgQ5JyPS6Qs2Hy501ejwBZmmFtuFalw/yfui7JswSS+VrwNydiMtnnSbOY9VY9SYjLRwtlqrTj9S997snIeX57K/TOz7UdTjx17UkUmDG3vYhCpPFkzpA2iRU0xy2LrZSCJBn9Pq0hz3PAY+uaJJ2bJjwvYqInTFW/Tc+39ZYL8zWV+OvLqKJ6Feryl9G8xs/plUajUVPIPzgRm5LmlaajUV6TZwWu7IfvHS5l0eh56dSVnxiyoSaHba2BaHSYpJalBpMkYF2TfmN+mBMxGXGrPrGt6Dc1gSOfC69Cmge8b3pGzVaT+4ujQTxe6+FQxavtO447plnXomA4REZGfwshbWVd1sGJaT1F0qzlUsNTMJKjr/7Ydol+WKsn/VlajwQzz/NmaOYpy5o8iWKyBR3SCXK30QU9uieRz41HNY17ct7JnRsNjfwPnR033sMbrEoFXnTjv/miN3Dy+8Z/hQbyrEOuEwRIUj1c0xX8KaHHH13DV3+csMi3+XUe6FcVRZZh9Oi3mmy+hATmQkwIFfAu69R4ntjIFyFYIKJCfhOvRg38C41CZPzzrSUybvF8+XfPoxkMKryr+dUb74q3FUo01lqyLMPaCqVmvT5pcneBrYWeGBMyCgpkWcbOlWX14IMPkqU53nv0NI3HL8jMxUQIpu52VStO954Nd+Yzubt7s60wfQUT51SakKaa948fB+/wNqRfKDoLiDi8uC/9Gm5OCPF6Ffw9vp07xMgx7a1Da40rBxRFQSdN5NDaBs/97hE1V0rCHIjJdjTBYEa50z03zIyIQ5wpESq0knbtjh6N6r+IJ3aigxjl6VAyRc/nmA9tYosUgi9FlKd2nsWFDhvXrrLYXYAMVO0gSbE16FnmU1XNmjM1Vp23WiaJItEKqxM63YLLFy/x/vGPeOzgIRa7KXqOLPS5kDZrLV6Cg8lbi3OOPM9xtkK8BYIjrchyZZuOZM5Eea5xLhRamxdGKYW1FhEh1QajFInWZCbB15ZEG/I0o6qqL/zdAnjngkQ5T56m4DyuqkiNwtd2dJ3eDa93PKnTnXxHmqZkWUZZD0iLhEE9QKcJWmv6/T5pllHamtI6vILSWbw2zVzq2TysGCwaJ+BEh0eY6RP+TwxeaWqv0FnB2uaA7vIqZeU5febc3O1TMhdNMksTtIJBfxPnarytcXWFc5aFokOehlWTIm4kImoUNovcmu0SSmutWeh2VV2VpEZTlwMG/U3yLMHamrK/Sbe4+RL3OzVaNGEKeNnfRCvob25gtGexU9DvbdDtdprz3XjGO0nO5LxDATt27GB9fR1jTLPxGPT7mxMzbQN+GEESFfwqs3oMy1LpZnby2KPxL1nrcU5CWLjTJUkSemWJ855+NV9zemc+zBmUA7I8rHxcWlri/l27WdvYRJxlZWmBfm8Tays6acZid2GY8rKuHemczQD8OtDmGtVas7S0RJZocBV5onCS4uoavGXH6gqry51b9jbjq6MmXm3nchBE59GHHub8pctYFLaqcDZsE9bNc3bv3q2EkOXNbJn80eZduRVl2SfvLLJv3161d+8DcnW9R78q6XY6FMUSm72NkASKdtgWrss3F6dn2ruPQuRaNz6TMT+SVmA9FEVBb7NGJIiKMYbdu3erIpsv02TmlkmRFyBh4s5CnvD4Y49QZCnXrlxiY/06vY01dqwuc/CxR1lZKsIFS/CrRO6MrXlg27+73YKDjzyC1BXiLKn2VP11diwv8dThQ/iJ2VMMB+ftAvmWyWVpTEwGqp3jqUOHlBbPYGOdlYUuS50cV/bZuWOVvXv2hKn+24jGbYc5AgudLnhHN0t5+cXvqQQBa9Hec+3SJahrxIaHd+Eh1oKtwZV4GyxhmcFRbInYGtVcI1se3takOviyDEK5uYHynscfeYTdO+cvEbia/X6ynso6yrKku7BI33pOnDolJ0+eDHvgiubpI4fZc/8DqpNqfO3I0pAcpix75MX8Feq84cf2Em4z07e5Rh3w1tH35NOzZ+j1eqRZxlOHn+TwY48qRZPJrRWHieFBqxej7HcKRqrSWCeVd2htOP7JKfn45CmuXr6KVgkH9j/EC8//jmo/O0wtSfCZGGOa0OeW/m5Ldd1cu8bC8ioesM11vX/iU3n99dcpigLvysmORxRe6WZOkx5GDMNUsK/2OHaHGM0Cn/wfLVCWJUWeUhQFu3fu4Peee1Z1Uo21Qp7cuMpqVsxcTJyrm4oDovWw16tssEGrKuwnnNDMdPQhj+mEkT0vpTnHtEOG0cblCpTCAdaF/6+lpkjD8nYDDHoDFjo3Jt+5czGByjpMkmKbl6wPyX2sDbM/83TkeDXahIVZ3MJfcsMMOI8rS0zeoXJCrUJMKkvANdPnt5rf45ZU+y2zFZPRdW39qRoYVI5uFoaAznkSo4dvnqdto2YuJnU1IM0yQIdFWU6QRGPGA4tNtvQ81SEHZlUHF1aaEsXk1oz37uN/t4LifDNehyYYrxhUAzpZGFJuFx4WFSyacZ+JaURl1NhHvpNKHFqFGZu1c2RbdqNz3g0tp3Z6+U39JVuvp6qCAGX5MFRsm3CpHxMTNfbx8UY75s//yifT3+ynTQwhhSbqFj5RlX201oi3ZHmH7WVpNsxcTMAjPiR+UUYPVwILYL1Ho4fq660nMa0x7PF1jU7zKCa3wFpLkgQ/ezt82Mrm5ibdhYUgKNJM6kozkG1SFahRgxzv3XUrJi1Ni2n30PWE3BxZmoXetl9SFDmiRt8hY2tVxq+brecdp67BGFxVY/JGUBQMBpaiSJr3S5hD0+y13K5/ab9V3WATzIDG8TpcQTy8umCJV2U/rBaWduFRUxBqfH+G2TIHYjLJra7mhsp6w4uRL8J42d9QrFu606336W7eP7VbdtuL+KaynW01e+ZOTCKRyNeT+ZG1SCTytSaKSSQSmQpRTCKRyFSIYhKJRKZCFJNIJDIVophEIpGpEMUkEolMhSgmkUhkKkQxiUQiUyGKSSQSmQpRTCKRyFSIYhKJRKZCFJNIJDIVZp5Q+rZ8jv1xbvuRm6yHv/ky+dss+f6c13jj99wtfril6k3Pc5Nru5vv3/YUEycIucPuNiPAnaQl+DxZBm62Dv5Wn73bz3xVGTC+TlkWZm6ZhCRIDgFqN9pDpRrUw9yj4hj+vbG2PixhERmmJ3V+lKq0tI6ysqMNmtpzVtXE3RFrQcA5GSb8sTJK/ON9k3+srsK+GtLswNZ8V1lZxDVbKUjIPVbZEo9D8FhbMRgMQKAalKPrJmQqc0BtQ2KoJnMh166tjd7kZewHtLnQJh+9qodv/vbNHkNtmXkr0B7HMqA5sXg8rrnOoVjKjY+2XLyEx/AFN7ouLxbr6+HLlYSzuuFeJH70aK7Deah9eP9GfzC8vLouw+8UNywnD9QuPMJ9GVUe8RZnR/v7yNg9bB+1l+E9reu6SVTth5+r7Oja+7XggPV+NfYbmvvuapxzwyIobbggV3vqMtSlqqrw3g+TYff7fSZoytDVow6q39+cLH8/KiPflE9bDpu9Qfj94xV7Tpi5mEDIqAYM0wgCGBPS/FWVQ2mwdSi5xaUlADY2NoZp/QYDO0w9OKgtaWJIsoTKeawNDxEhy0J+U7Gh0akkAQXaKOqmnisVcod6gshtpS4t3ns8kGQJSmuqfh+UYVCVmCTHisejMUnWJDV2ZHnYg8Z7T+XsKPdootEayjpUxtXVZURg7fp6uJibEgqqyDLAU1YlHqGua2xdh3M3OQv12H4OTmhy6Lb5xobJyBg+GaukbcNtd8xzbZG0+QfFoZVGRGFF8NJkwAcG1ahzQMBZS11VIUmYHqWL7HSKprH75p6GL61tPfwabcLDE5LxVZWl3+uhlMYkCdZarHfUtQtJs5vPbQ4Gw9/vCZt1KaVw1g5TWKZJSlWHe2rSkBe36GTULpRVuxmZiGCMYXOz33zOUNeC0po0S+gPSrIsG252JiJ0Oh1EhPX19VG5KRBpM6mBSccGCA5sI1Jaw2avJG/Kp1c7im4RkhEKw/s8L8xcTLx4TNNojDah4QM6bSqwDqn2TKYaC0RAQd4kPm4+OKw8SidYD/3SorQOjTXRDMqm4BWgmzSGrVVAyIJnHU1jCG/VKkEclHZ009I8wySa9c0ytDkFWXehsbCaiq9S1jY3g/XhhNqNeiGl9LCBVjZYT5WFrEgQFa4BBcurS2z2xnu1Jps6rakbnms0SBBfo1OSNCXJUkRBWdXDhosatxTal25vNGsNm5sV5VhP2pajr6vQnQPGhJ0BtQoi4jwUeUZZlsHCU2CShDTPsM6PCXb4fFnV1LYepmpUSg1TTG5sllgJPXUrZkmS0FnoUg4qEE2SJBhtSFOD0YqqcljCnjPWQdXsHNhaCsZkSLMbl3NClurmb2irSpvhMstCCsvW2lhY6DAow/mSTIXMiUBe5AzKmv6gCh1RI6qiYGFxKVhGoc8gSUcb3ra/04vHyShP79rmgG43dELWB6uqvV7UqMOdF2buM2mtC+eEcxcv8MYbb0lZVRiT0O/3WVpaYnV1lf379vLYww8q58NNTrOMunZUXsjzhAuXrvLee+/J2toaV9eus9jpcvDgQQ4ePKi6RYpOk1Hnq9q9aEMDO/7BCTlx4iSXr13F6JT77ruPg489wsHHHlIKRVF0hwojQOXgn/7lXwWgSDU/fPlPVJJpTFLggIuXrvDqq68K3vLMk0/x1OFDylpPkoRKkiThWo4dOyanTn7K1atXGQz67N+3j8OHD/PwgwdUlmkWFjrbmLLjmflDBdRKo5tEuYNBRVFkfPDhh3L06FF+8IMfqKWlJYxRqPFd5BBE/Chpc2sCtH835dQbOF752U8ly1JefPFFVSQKCe0EnaZ4V4E3DKoBJu2wsdnjX3/2U+lkOX/8/RdVJ8+HkuWc4/KVy/zytdfl4pXrZFnG4uIigqUu+zz15CEOHzqoABITrMbjH38i7x57n8SE7Up7GxsUeUJmNPv37eH3v/37ShB6mz2yIkebhPVejzfffkdOnjxJXYfdD37n6SM8c+Qp1el0Qi5cbdCJYW1jnb/+27+TvOiCMZgkWBZlf4C4ikF/k7/483+v8jSh2+3iEU6f+Yyfv/pL2bt3Hy/+0R8o58DVlqxIeOut38i5i+d46cXvq7wAW1egNb72HD/xsRw/dpxDTx3m4KOPK60V42luvfdBTFUQzuPHj8sHHx4PCdaNIUkMvqypq4p/9/IP1K5dq3fd3r5MZi4mGoUyyfDZ6c8+QyeG/fv3081T+mXJqXePcurT09y3Ywf3LXVDTl0gTUOW8/VBzSv/9m9y8eJF9u7dy+qOHbja8rNXf85nF87LH73wXbXQzYOJLMFPkWUak2hee+1Nee/99zFZRndhCa0Tzl04z9nPPsX778rjDz+kxFchc7rWqCTDGLh05XLIGq40XmscoJPQ23xy5oysbWxQDQasbfYaa0UPfRBawdH33pN33v0ticl55nefRSnFJydO8rc//jt+8Ccvy7NHDqt22LV9qQXMWAJu70ElKQ64vtnj1JmzVF4QE0x3pUZ71IjzGJM0PpOGbb7LescnZz4ly9JJ4SH8EN30jp2iE7aYyDLOnz/PYqdL3m7P0IiWNgaM5vKVKzhR7N2/j8uXL2M0GJ2SpimJScL1EXbSAbh44TJF0WV1dZmFhQU0QpoY0qzAutCTLywE6/Daeo9//pd/kfVej90PPMCuXbu4fvUqb7/9NkffeVv+63/+LyrLEjY2eiwsdMmzDouLi+RFl9JaLly8hIhw/67d5GmHxBiyLKPbbPmhUOzYsYNut8tHH33Egw8+KI88vF95n/DZ+Uu8/+EHrO5YIesUjQWShaOBXr/k7LnzPPrEEyTZaOjl0SFHdCv2EiykCxcv0S9rlrtLpGkatj51DPcW8jLrHQknmbmY9PtlUN00IUlT0jzjoYcf5o9e/CPVblHwztF35fXXXuODjz6Sbz/7O0p7sLUlb4YGr7zyipw7d44/fvklnmp6tsoJP/vZz+SDD46xc+dOee53f0eJh0RDlumhJfTa66+z/6GH+O4ffk+troQNvc6ev8xP//UV+dmrP+ehA/vp5h1UEzkZuuO8p7u4hK8sHxw/KY8/8YhyEpKFv3vsA1ZXd7C+do286FA5yEwYQlVOSBLFBx98wOZGn//6v/8n5ZyjyFOefPJJfvKTn8jyyqrygK3C9h63C0PUVUWaZ4iEc3ugWOhy//69pN1i6NNTTeXTKGxr4jHax2X4NWMZ6IsiY3l5mTRNRj4LNdoCw9WhMVvvUGk4X2Iy8jwfnqP10XiCkG8OBuw78BDf+v3nVTcbuhGG3z/ymoBDMGnC/gMP8kd/+O1mB14mNqDa7A3odgsq53Hec+X6NfYfOMAPXvq+an/bmScOcfKjj6T2QgYsLnZDI88S/vTP/r1KDGyUnh//+O9lbWOdH/67H6o8odlaxQKafjkgTXI6nYLvfe9F9dc//lt57c03eOTh/SgDv/zlryTNcl764z9RWdb4/JpN2BOtybKMotshScJQ3DlPlmq0Cp2D1nrkT0oaH6Jz/P63v6NW7lsmTRIy3W4tsv02JLNk5j6TTpGTpQlKQZKk2NpDY6m0EY+su4A2KdZafNMG8iTBO7h0+TonT53mwEOPcPjQQSXAZulIjeLlP35RdboLfHTiBJWVYRSmjdq8994xMVnGc9/+lrpvpUvVjMf3PbCTI0eO4Jzj6NGjYiXsOmjFUzXe/M5Cl927d9NdXOKd376LGEgS2OhZBmXNrvv30OuXOFHDDdbDvlehyezYsYOsyDlx8qR08rSxtDQvvfSSOvDgHryHJAv+otvVmbTxH3344Yfy/rHj8s5v35OTp08zKCtOnDwlv/3guPz23fflzJnPxj4VLKVxT0jrAxp/fnVtnbKuKOuqibg1gZzmfSYJTug0NYgw3DHQ+uAf8OORFQGdJiRZSrHQJc2GLpfh1/YHfcY3MRevSNOctqoK0KscaSOaXhg61o3R1LXFWsfa9Q02+3a4I8T+fQ/wwgsvKNVs0iXA5mYfL8FqEKDIg+NUKUWWjMrdNY6aIh9tSLay3OXpp57h/LmLvPmb9+Xoux/Ip5+d5cmnn6K7UAT/jofUGBSaWqBXllQ2OOfRkKST4XStg4NcWr+dTijriu7iAp0sIdHN5nQEP5Ydv3lzwMwtEwBrWyeoYL3DeU8NXL2+JiLCseMfUtqa+x/YizHBnNcm9LIbGz3Jsoz79zww7GG7ucFK2DluZWWFCxcukCTBY1DVoTcwRnHt+nXyPGd1dTV48s2ocd13330YY7i+vhZ6VgMoPTQrq6pis9/n0Uce4/U338DasIvcb44eFVGG3bt3Y0zKYDAgScP2LmkaKm5lhaeeekqd/PSM/OQnP+EXv35N7t+5i8cee4xDjz+iPCFUvHVnzG1xgAnh31/96ldsDErSboFJUryCn736c5QXjFYcfvwJ2bNrp+oUGYlqTz7pg4FJ8ep2uxP712gTGr61njTRTWg87HmkFShlsNYGB2oyEongXAz+Iusc5z67wNu/eV80Hi2eJx57XK0sdegUnVAnfBjmaK1xzvHxiROU9UCuXblKp0h44fnvqPt3rYahm9YMao/Smt27Vjly5AjvvneMv/qrv5KdO3fy0EMPsXPHKgf271Fhx/LgW1pY6AydwKYxAMuyRBDqxpoE6HTyIChaYYweCuBzv/e0Ov7xR3L03d+SaMPePft59pmnVFl7MhP2e3Jj5x5udarVcLfBtrxbARmvg1VVkec5P/3pT2UwGJAkCYudgh++/JLqLGSztwS2MHMx2dwYsLBYUDuGDtePP/6YY8c/FJMmKKXI04zvfve7HDiwRyma8G3lMblGKUVdh/j/eOFWVU2Sp2RZRpZlXLlynV07VshSTVU3w4cGrTW1Cw0doBZYXFxU1lrxTejFe49uKwgMd5w7cOCAeue3R+Xo0fflmWcPq7Nnz/LUU09NbBQOQUggiFmaalZXV/nf/st/Vp+ePSevv/U2Z86c4dy5c/z6F6/Kt771LX736SdVVQm33em++RlKKX70ox8pi8Jp+PjESXnj7bf4i7/4C7XY6ZIYjbJ+JAxGgQha3XoLKudc2BArG1WVqvZ00tEugUqN4kLj+xqPo5RCvMd7T5qmlGXJsWPHqMs+i52C+5ZXZGXpgLLWYxKF0Yq62cmxrmuKzgJFUbC0tIRWjqIohqLXfmdrYbzwnW+rAw89wunTp+XTTz/lzTffpLe5zhNPPCEvfe97qlNsHwVxAnme0y8HGDMpqu3ezFv54Q9/qP7b3/y1iAg/+vP/oCor5Kke1kWjoT+oyYsUEUEnJoSYVbCOUzUagioFg4EjK8ywzLTWpGmK9z74dhJDXTuS/MbN1GbNzMVkYbEIjkMVesG6rDj85JM8/ezvqLNnz8orr7zCkUOHefbwE0oTCnshN8PKurKypIwxcvH8BaqmN/ceunmoMFevXqXbCePU9gZnjXmZNS38/Pnz8tD+vSqMjCFX8PHZs6K1ZmlhEQjRhdZcFxiK1477MpYWFzh58iSPHXyU/uYmD+7bQ5akCrw454YT0oxhGNEJW2HCysqK+g//0/8IwJmzF+X/++//wDtvvc0TjzxGt3vnoT9lYGGhi1dBDJVS1IOSPEkpipxMgSTBZxQ+0P5zo5SMB3ayLAvOv8QwcI7CGJIk+I4MYZgDwVJxKgx3Op1O+P7KU2Sa2jqSRJMZQ5IkbG5s8PDjB/nTH76sFFAOapaaBi44rA1zP7QOjTvPcw4cOMDz33lWpQo2+iVLnRznwNqaPE9Jml9iXRhO7Nuzk317dqrvPP97DCrLL1/9hRw/doy3Fhfluy88r4oiDI1aPxKEo4hDnKXdJ2/U5fimXPRE+awuh+iQt45Uh5M000CGfqBWvJRS4Ech5kSFeZBJU2et9RSNkJR1KPter8dzzz2ndu9YRhGEvEg1rg43YJ72Gp75pVS1RRCMgbquWFu/Rj3oc18n5+nHH1UH9u7h6FtvcvrMZ2FI34iIzoIvIkkSHnn4AOWgx9r1a6QK0sYUP/bhR3Ll8iXu37WLleUFIHjJlQ8N4dChg/TW1zn+wYfD/7M+9BgnTpygrmseeeSRxhHs8S44ATSQaDPskQ8dfJyNa1f56Nj7kiWGXTvvU0ociGN5sYsxozkLWkG/LHnnnXfk7//ff5SVhc6w0u3etUM98MADDAYDrq9dCyFYuc0U6rH/bI0BkebHSNjkOm39G2N3W/xIRFrnq4IbHDRra2v0er0m0hJ2gNbNHBbvPb7xJySJJjFhLsT169epBj3yLHxhnhgMis1en43ra6wsLVOkGZu90GgXm8bWzqRphwNGQa+/Qa+3gdIybPTdTph7kRjI83Zyo8ULrK+v84tfvConT5+RMIfH08kSDh48yOrqKoPBAFuFSYMbG73Gj9XM7iVMamu/v278E7fxf2M05I3lppvyb8vUVhbvQ1xKrEVpwfl6+Nkwk1lIktARquF1BJFZ7C7gaosDemU9tKjTdDRMmhdmbplk2Wj+h3eO1eUVsjQ4JK0TXn7x++ov//Iv5cNjH/Do/r10cs1gUKFRZEXK0kLOoUOH+PGPf8zf/vXfyB/8wR+QdwouX7zEsWPvs3/vPp547HFlaCqF8+imkh96/KA6efITOX3yJP/tr9flyDPPYkzK22+/yZXLFzly+Cn27L5/uBetUSA6hH/zPMdWJQo4fOhR9fZvXpej77zNkWeeYSEzXBr0xNU1mxvreDsSEwVkSUpd15w4+RH/8I//JE8++STdbledO3NWLl+4yP27d7F7x87hZ26Jap2eKvR4RmGAnav3qUOPPi65Tth6Go+E+SlNr3wrB+/O+5YpioLNzU3e+c07kpoEW1ZIXfHg/r3qwQf3Udclg6qmu7BIUWQsLHYwjfDYyjbDFsNSt8NgMKC/sUFvY5PlbjKy2lSY2dpabt57HIrFxUWVpqlcvXqV115/W4zS2LokTxJWV5Z49MBDKs9TsjQ4aNbX1jj18QmuXr3G+vq67Nq1S12/elU+fP8YdTXgvuWlYYe0tBiid4ZGUBxhHYI0M1CHw7fWJm18H01Ur9XmRBtMsxm7gtDhmFCw+Vj9TpMEg+KzM2dRgjhnKRJDWfY5cviIKoqMumqslkxx/fp1RIQPjx+Tq9d2UVUVhUnpbW5w/307efzgw3MlJzMXEwGss2F+gTjqfp/1K1dJgNQo8k6Hpw4e4viHH/DG0rI8//xzwURtOlbr4JEH96r/+c/+TH7961/z61/8gn5VkpmEBx54gOeff17t27MbCBufZ5lu4vSCMYqXXvq+euvtd+SNN97kXy/9M1la4L3nW7/7e/z+t55VhtCLK61Dl+Nhsz/A1ZbN9Y1QoQQyrdmoag49HoQL71Hi6GQpuhkQt2uAEqM5cuSIWl5ellf+9d/45MRJ0jQRRLj//vt54fnvqCzT1JUNjQS2dI9+UgBUqPigEAk95aMH9rFrdUUt5CNHnW9agEKFKMxYA5mYTt+8phRcuXwday2b/U1ee+01XG0xKHKjuXrlkjz44D6VpilJGubxXL58NaxfEWGzV7LUzYMV1PiYXFWjlaLshzUmrRUZenQZWldKKVKlWL92Xcqqz/nzn3HmzOnQcLVgqwFGweH/4/9s3h8u/eGH9vMff/QX6qf/9qr85J//meXlZamqik6Wc+TpwzzzzDMqSw3iwj1du36d5dWVpnw8zjnKsqTXK1layJlYU7Rlmg3ARq9kMBiQJwn9fsViJ0OUGoVtBcQ5eoMS5R1GKz49dYpPP/2UqipxZY/FbsGeXbt58MEHSVM1DM13ipxLly7xm9/8hsXFRcpygFQWrRQvvvCHE9c0D8x8r2HrQxy+nYvgHHgvpKmi16uHfoPr1zfJs4ROJ6csa/IsHRa6bXpY62FjY5MsyzDGBN9I839KwLtmFqpAOajIiwxRo7H2+QsXybKCXTuXQmNqhgvWDciyYFqjQk9zdb3P8lIHX1myLMELODzWC87VZFmBrWqMNKZ4O6rQo3CoC0+5eOEqSWroZDlFkQePfiN2W2eltica1VVppsW35Sck4/ZvU+GcE0R5jDaM+0mG7xQ98X4A13z9er+i28korcMoTWFCoYm34buU0C8tSV6ggIH1JEqTGtAiKCV456jrmrzo4gUs4b64JgomHpwdkGoTnAlohBA5ubreo7vQpaocaRIicUYEcTVGaRKTUNUVTjzOCp2FDtYHS+ez8xdZ7HRZ6BakicEQRMvVliQb2Wz9siLLCzb7FVprOnlCNajoFK03ZvxG6OGcIwHW1nukScJiJwvDGRe+25YlSTMVP4xhoKzCMlCTGLQG8Q6NJ9HBKZ2nOb6xbHq1I8sM1zb6LC922upDPajo5BneCTqZHzWZuZjUzqJNgrM11lo6RQdnPXhFkiqcDT1Gmm1x76gQxsvynPX1PktLnWZSlCNNRpXENo1d0URklMY3cwnahX619ehkMuY/GNQsFGnovZuJIr6uqV2YsSs6IUnACPi6hCRFaXCoZgGdnjB7y36fvNMBraibKfCOIFhtfXA1oBrB84Tp7m04UU2KSCsIod/0JIzWGykJjlFpHNuoYF15JMxCxWPDbAd0O5t2GzGRxpnrCA2/9kKqFbq55rqqMIlgtEFImlXQgkMoEo21jiIxeFej25iyhEblaEL8enzCXGsBeBBF5TzKpDg12QFbJxRG0fqyaM7VllW7oNmLDNd9QZgklg8dRx5f1dTNVIROd3FCMrwHcRV52igdrfNqUkzWNwcsLBThWgR665ssLnSaSEATohnX9ua3h1XuHo2QaNAYvHXDcnIuTFyrHHg98o8oAd2ElZ21k4sEZ8zMxSTc9LCq1+gwzm6ny1dlHSIuzf2vypo0NSitqW0dQmbtBB9GlbMNtbWx+9b0r+uaNEnH3uiprSfNg2VRNy+LwHDiqbjQfQ6dHqEJClCWNUWWEpwiYXVpmo0tQJQwUS5YAw0KBlVJ2lg60lggthLSJgzsXJgXMsENYgJBRjTWW1JtGlnQk29q5qG0390OkWpxGDU2zt8qJmo0wc9JaATteweDkoUiHwqA4HAelE7HDTDEOxJtqKsBaZqCUlSDGp2kYRFm85XeBetFNULSioL1gtKmcVSGn9LaCQbwzpKoICJh2Breu9Ef0O0UN3QsenhPPFrJSHycw5iU2llENQsFBxWdIqzIDqo8aZm0dSBYtR7lhSw1o0kjMKp8KqiDhxAaZsJQpRz0wvovCZ2BMXp4G9v3CWE1cZ6YYQe1VahmzczF5LZ8jnHhbT8y/pPVbV9mMny6TQDsc17jjd9zt3wJyZG2vP9mtePG8rn75Eh3wq1q583Of2fXfOvP3vz+w3gd2Pb9d3ABd3r/v4wy/bKYfzGJRCJfC2Y+zyQSiXwziGISiUSmQhSTSCQyFaKYRCKRqRDFJBKJTIUoJpFIZCpEMYlEIlMhikkkEpkKUUwikchUiGISiUSmQhSTSCQyFaKYRCKRqRDFJBKJTIUoJpFIZCpEMYlEIlMhikkkEpkKUUwikchUiGISiUSmQhSTSCQyFaKYRCKRqRDFJBKJTIX/H8+EyjROu/tIAAAAAElFTkSuQmCC";
import { useState, useMemo, useRef, useEffect } from "react";
import { supabase } from "./supabase";

const CSV_COLUMNS = ["nominativo","email","reparto","serialePC","modelloPC","dataAcquisto","dataConsegna","sim","numeroCellulare","accountMicrosoft","note","stato"];
const CSV_HEADERS = ["Nominativo","Email","Ruolo","Seriale PC","Modello PC","Data Acquisto","Data Consegna","SIM","Numero Cellulare","Account Microsoft","Note","Stato"];
const emptyForm = { nominativo:"",email:"",reparto:"",serialePC:"",modelloPC:"",dataAcquisto:"",dataConsegna:"",sim:"",numeroCellulare:"",accountMicrosoft:"",note:"",stato:"Attivo" };
const defaultRepartiList = ["Back Office","Front Office","IT Management","IT","HR","Sales","Finance","Operations","Marketing","Direzione"];
const stati = ["Attivo","In manutenzione","Dismesso","Smarrito"];

const ALL_COLUMNS = [
  { key:"nominativo",      label:"Nominativo",    always:true  },
  { key:"email",           label:"Email",          always:false },
  { key:"reparto",         label:"Ruolo",          always:false },
  { key:"serialePC",       label:"Seriale PC",     always:false },
  { key:"modelloPC",       label:"Modello PC",     always:false },
  { key:"dataAcquisto",    label:"Data Acquisto",  always:false },
  { key:"dataConsegna",    label:"Data Consegna",  always:false },
  { key:"numeroCellulare", label:"Cellulare",      always:false },
  { key:"sim",             label:"SIM",            always:false },
  { key:"accountMicrosoft",label:"Account M365",   always:false },
  { key:"note",            label:"Note",           always:false },
  { key:"stato",           label:"Stato",          always:false },
  { key:"hardware",        label:"Hardware",       always:false },
];

const THEMES = {
  black: { bg:"#0a0c10",surface:"#13161e",surface2:"#0a0c10",border:"#2e3650",border2:"#4a5680",text:"#edf0f7",textSub:"#8892a8",textMuted:"#424d60",hover:"#181d28",inputBg:"#0a0c10",selectBg:"#13161e",link:"#6ea8fe",tabOn:"#1e2330",accent:"#4f6ef7",scrollTr:"#13161e",scrollTh:"#4a5680" },
  dark:  { bg:"#131929",surface:"#1b2236",surface2:"#131929",border:"#3a4f78",border2:"#4e6494",text:"#dde5f5",textSub:"#7f90b8",textMuted:"#4a5878",hover:"#1e2a42",inputBg:"#131929",selectBg:"#1b2236",link:"#82aaff",tabOn:"#1e2a42",accent:"#5b7cfa",scrollTr:"#1b2236",scrollTh:"#4e6494" },
  light: { bg:"#f4f6fb",surface:"#ffffff",surface2:"#eef1f8",border:"#9daed0",border2:"#6b85b8",text:"#111827",textSub:"#374151",textMuted:"#6b7a99",hover:"#e8edf8",inputBg:"#ffffff",selectBg:"#ffffff",link:"#2563eb",tabOn:"#dde5f8",accent:"#4f6ef7",scrollTr:"#f4f6fb",scrollTh:"#6b85b8" },
};

const statoColor = (s) => ({"Attivo":"#22c55e","In manutenzione":"#f59e0b","Dismesso":"#ef4444","Smarrito":"#8b5cf6"}[s]||"#888");
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("it-IT") : "—";
const fmtTs = (ts) => { try { if(!ts) return "—"; const d=new Date(ts); return isNaN(d.getTime())?"—":d.toLocaleString("it-IT"); } catch{ return "—"; } };
const parseChanges = (ch) => { if(!ch) return null; if(Array.isArray(ch)) return ch; try { const p=typeof ch==="string"?JSON.parse(ch):ch; return Array.isArray(p)?p:null; } catch{ return null; } };

function toCSV(data) {
  const rows = [CSV_HEADERS.join(",")];
  data.forEach(a => rows.push(CSV_COLUMNS.map(k=>`"${(a[k]||"").replace(/"/g,'""')}"`).join(",")));
  return rows.join("\n");
}
function downloadFile(content, name, mime) {
  const blob = new Blob([content],{type:mime});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href=url; a.download=name; a.click();
  URL.revokeObjectURL(url);
}
async function exportToXLSX(data, filename) {
  if (!window.XLSX) {
    await new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
      s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  const XLSX = window.XLSX;
  const rows = [CSV_HEADERS, ...data.map(a => CSV_COLUMNS.map(k => a[k] || ""))];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = CSV_HEADERS.map((h, i) => {
    const maxLen = Math.max(h.length, ...data.map(a => String(a[CSV_COLUMNS[i]] || "").length));
    return { wch: Math.min(maxLen + 2, 40) };
  });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Asset");
  XLSX.writeFile(wb, filename);
}
async function loadXLSX() {
  if (window.XLSX) return window.XLSX;
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    s.onload = () => resolve(window.XLSX);
    s.onerror = () => reject(new Error("Impossibile caricare SheetJS"));
    document.head.appendChild(s);
  });
}
async function parseXLSX(file) {
  const XLSX = await loadXLSX();
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: "array", cellDates: true });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
  if (rows.length < 2) return { records: [], errors: ["File vuoto o senza dati"] };
  const normalize = s => String(s).trim().toLowerCase().replace(/\s+/g, " ");
  const header = rows[0].map(normalize);
  const colMap = {};
  CSV_COLUMNS.forEach((col, i) => {
    [col.toLowerCase(), CSV_HEADERS[i].toLowerCase(), normalize(CSV_HEADERS[i])].forEach(alias => {
      const idx = header.indexOf(alias);
      if (idx !== -1 && colMap[col] === undefined) colMap[col] = idx;
    });
  });
  if (Object.keys(colMap).length === 0) {
    return { records: [], errors: [`Nessuna colonna riconosciuta. Intestazioni trovate: ${header.slice(0,6).join(", ")}`] };
  }
  const records = []; const errors = [];
  rows.slice(1).forEach((row, li) => {
    if (row.every(c => String(c).trim() === "")) return;
    const rec = { ...emptyForm };
    CSV_COLUMNS.forEach(col => {
      if (colMap[col] !== undefined) {
        const val = row[colMap[col]];
        rec[col] = val instanceof Date ? val.toISOString().slice(0, 10) : String(val ?? "").trim();
      }
    });
    if (!rec.nominativo) { errors.push(`Riga ${li + 2}: "Nominativo" mancante`); return; }
    if (!rec.serialePC)  { errors.push(`Riga ${li + 2}: "Seriale PC" mancante`); return; }
    if (!stati.includes(rec.stato)) rec.stato = "Attivo";
    records.push(rec);
  });
  return { records, errors };
}
function diffAssets(before, after) {
  return CSV_COLUMNS.filter(k=>(before[k]||"")!==(after[k]||"")).map(k=>({field:k,from:before[k]||"",to:after[k]||""}));
}

export default function AssetManager() {
  const [theme, setTheme] = useState("dark");
  const T = THEMES[theme];

  // data
  const [loading, setLoading]   = useState(true);
  const [dbError, setDbError]   = useState(null);
  const [assets, setAssets]     = useState([]);
  const [hardware, setHardware] = useState([]);
  const [history, setHistory]   = useState([]);
  const [reparti, setReparti]   = useState([]);
  const [checks, setChecks]     = useState({});
  const [checkLabels, setCheckLabels] = useState(["Email","HSW","Talkdesk","Opzione"]);

  // ui
  const [newReparto, setNewReparto]       = useState("");
  const [showAddReparto, setShowAddReparto] = useState(false);
  const [showRepartiManager, setShowRepartiManager] = useState(false);
  const [view, setView]         = useState("table");
  const [prevView, setPrevView] = useState("table");
  const [editId, setEditId]     = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [form, setForm]         = useState(emptyForm);
  const [search, setSearch]     = useState("");
  const [filterReparto, setFilterReparto] = useState("Tutti");
  const [filterStato, setFilterStato]     = useState("Tutti");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast]       = useState(null);
  const [sortField, setSortField] = useState("nominativo");
  const [sortDir, setSortDir]   = useState("asc");
  const [historySearch, setHistorySearch] = useState("");
  const [importData, setImportData] = useState(null);
  const [importMode, setImportMode] = useState("aggiungi");
  const fileRef = useRef();
  const [hwForm, setHwForm]     = useState({tipo:"",marca:"",modello:"",seriale:"",stato:"In uso",assegnatoA:"",note:""});
  const [hwEditId, setHwEditId] = useState(null);
  const [hwView, setHwView]     = useState("table");
  const [hwSearch, setHwSearch] = useState("");
  const [hwDeleteConfirm, setHwDeleteConfirm] = useState(null);
  const [hwSortField, setHwSortField] = useState("tipo");
  const [hwSortDir, setHwSortDir]     = useState("asc");
  const [editingLabel, setEditingLabel] = useState(null);
  const [visibleCols, setVisibleCols]   = useState(["nominativo","reparto","serialePC","modelloPC","numeroCellulare","sim","dataConsegna","stato","hardware"]);
  const [colOrder, setColOrder]         = useState(ALL_COLUMNS.map(c=>c.key));
  const [showColManager, setShowColManager] = useState(false);
  const [dragCol, setDragCol]   = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [colWidths, setColWidths] = useState({});
  const resizingCol   = useRef(null);
  const resizingStartX= useRef(0);
  const resizingStartW= useRef(0);
  const tableRef      = useRef(null);

  const HW_TIPI  = ["PC","Monitor","Telefono","SIM","Cuffie","Altro"];
  const HW_STATI = ["In uso","Disponibile","In manutenzione","Dismesso"];
  const emptyHwForm = {tipo:"",marca:"",modello:"",seriale:"",stato:"In uso",assegnatoA:"",note:""};

  // ── load ──
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [aR, hR, hiR, rR, cR, lR] = await Promise.all([
          supabase.from("assets").select("*").order("id"),
          supabase.from("hardware").select("*").order("id"),
          supabase.from("history").select("*").order("ts", { ascending: false }),
          supabase.from("reparti").select("*").order("nome"),
          supabase.from("checks").select("*"),
          supabase.from("check_labels").select("*").order("idx"),
        ]);
        if (aR.error)  throw aR.error;
        if (hR.error)  throw hR.error;
        if (hiR.error) throw hiR.error;
        if (rR.error)  throw rR.error;
        setAssets(aR.data || []);
        setHardware(hR.data || []);
        setHistory(hiR.data || []);
        setReparti((rR.data||[]).map(r=>r.nome).filter(Boolean).length > 0 ? (rR.data||[]).map(r=>r.nome) : defaultRepartiList);
        const chMap = {};
        (cR.data||[]).forEach(c => { chMap[c.key] = c.value; });
        setChecks(chMap);
        const lbs = (lR.data||[]).sort((a,b)=>a.idx-b.idx);
        if (lbs.length === 4) setCheckLabels(lbs.map(l=>l.label));
      } catch (err) {
        setDbError(err.message || "Errore connessione database");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const showToast = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),3500); };

  // ── computed ──
  const filtered = useMemo(() => {
    let d = [...assets];
    if (search) { const q=search.toLowerCase(); d=d.filter(a=>["nominativo","serialePC","numeroCellulare","sim","accountMicrosoft","email","modelloPC"].some(k=>(a[k]||"").toLowerCase().includes(q))); }
    if (filterReparto !== "Tutti") d = d.filter(a=>a.reparto===filterReparto);
    if (filterStato   !== "Tutti") d = d.filter(a=>a.stato===filterStato);
    d.sort((a,b)=>{ const va=(a[sortField]||"").toLowerCase(), vb=(b[sortField]||"").toLowerCase(); return sortDir==="asc"?va.localeCompare(vb):vb.localeCompare(va); });
    return d;
  }, [assets,search,filterReparto,filterStato,sortField,sortDir]);

  const filteredH = useMemo(() => {
    if (!historySearch) return history;
    const q = historySearch.toLowerCase();
    return history.filter(h=>(h.asset_nome||"").toLowerCase().includes(q)||(h.asset_serial||"").toLowerCase().includes(q)||h.action.toLowerCase().includes(q));
  }, [history,historySearch]);

  const hwFiltered = useMemo(() => {
    let d = [...hardware];
    if (hwSearch) { const q=hwSearch.toLowerCase(); d=d.filter(h=>Object.values(h).some(v=>String(v).toLowerCase().includes(q))); }
    d.sort((a,b)=>{ const va=String(a[hwSortField]||"").toLowerCase(), vb=String(b[hwSortField]||"").toLowerCase(); return hwSortDir==="asc"?va.localeCompare(vb):vb.localeCompare(va); });
    return d;
  }, [hardware,hwSearch,hwSortField,hwSortDir]);

  // ── asset CRUD ──
  const openNew    = () => { setForm(emptyForm); setEditId(null); setPrevView("table"); setView("form"); };
  const openEdit   = (a) => { setForm({...a}); setEditId(a.id); setPrevView(view); setView("form"); };
  const openDetail = (a) => { setDetailId(a.id); setView("detail"); };
  const sortBy     = (f) => { if(sortField===f) setSortDir(d=>d==="asc"?"desc":"asc"); else{setSortField(f);setSortDir("asc");} };

  const saveForm = async () => {
    if (!form.nominativo) { showToast("Nominativo obbligatorio","error"); return; }
const clean = (v) => v === "" ? null : v;

const payload = {
  nominativo: form.nominativo,
  email: clean(form.email),
  reparto: clean(form.reparto),
  serialePC: clean(form.serialePC),
  modelloPC: clean(form.modelloPC),
  dataAcquisto: clean(form.dataAcquisto),
  dataConsegna: clean(form.dataConsegna),
  sim: clean(form.sim),
  numeroCellulare: clean(form.numeroCellulare),
  accountMicrosoft: clean(form.accountMicrosoft),
  note: clean(form.note),
  stato: form.stato
};
    try {
      if (editId) {
        const before = assets.find(a=>a.id===editId);
        const changes = diffAssets(before,{...form,id:editId});
        const { data, error } = await supabase.from("assets").update(payload).eq("id",editId).select().single();
        if (error) throw error;
        setAssets(prev=>prev.map(a=>a.id===editId?data:a));
        await addHistory("MODIFICATO",data,changes);
        showToast("Asset aggiornato!");
      } else {
        const { data, error } = await supabase.from("assets").insert(payload).select().single();
        if (error) throw error;
        setAssets(prev=>[...prev,data]);
        await addHistory("CREATO",data,null);
        showToast("Nuovo asset aggiunto!");
      }
      setView(prevView);
    } catch (err) { showToast("Errore: "+err.message,"error"); }
  };

  const doDelete = async () => {
    const a = assets.find(x=>x.id===deleteConfirm);
    try {
      const { error } = await supabase.from("assets").delete().eq("id",deleteConfirm);
      if (error) throw error;
      setAssets(prev=>prev.filter(x=>x.id!==deleteConfirm));
      await addHistory("ELIMINATO",a,null);
      setDeleteConfirm(null);
      if (view==="detail") setView("table");
      showToast("Asset eliminato","info");
    } catch (err) { showToast("Errore: "+err.message,"error"); }
  };

  const reloadHistory = async () => {
    const { data, error } = await supabase.from("history").select("*").order("ts", { ascending: false });
    if (!error && data) setHistory(data);
  };

  const addHistory = async (action, asset, changes) => {
    const entry = {
      ts:           new Date().toISOString(),
      action,
      asset_id:     asset?.id         ?? null,
      asset_serial: asset?.serialePC  ?? null,
      asset_nome:   asset?.nominativo ?? null,
      changes:      changes ?? null,
    };
    const { error } = await supabase.from("history").insert(entry);
    if (error) { showToast("❌ Storico: " + error.message, "error"); return; }
    await reloadHistory();
  };

  // ── reparti ──
  const addReparto = async (nome) => {
    if (!nome || reparti.includes(nome)) return;
    try {
      const { error } = await supabase.from("reparti").insert({ nome });
      if (error) throw error;
      setReparti(prev=>[...prev,nome]);
    } catch (err) { showToast("Errore: "+err.message,"error"); }
  };
  const removeReparto = async (nome) => {
    try {
      const { error } = await supabase.from("reparti").delete().eq("nome",nome);
      if (error) throw error;
      setReparti(prev=>prev.filter(r=>r!==nome));
    } catch (err) { showToast("Errore: "+err.message,"error"); }
  };

  // ── checks ──
  const toggleCheck = async (assetId, idx) => {
    const key = `${assetId}-${idx}`;
    const newVal = !checks[key];
    setChecks(prev=>({...prev,[key]:newVal}));
    try {
      const { error } = await supabase.from("checks").upsert({key,value:newVal},{onConflict:"key"});
      if (error) throw error;
    } catch (err) { setChecks(prev=>({...prev,[key]:!newVal})); showToast("Errore spunta","error"); }
  };
  const getCheck = (assetId,idx) => !!checks[`${assetId}-${idx}`];

  const saveCheckLabel = async (idx, label) => {
    setCheckLabels(prev=>{const n=[...prev];n[idx]=label;return n;});
    try { await supabase.from("check_labels").upsert({idx,label},{onConflict:"idx"}); } catch {}
  };

  // ── hardware CRUD ──
  const hwSortBy = (f) => { if(hwSortField===f) setHwSortDir(d=>d==="asc"?"desc":"asc"); else{setHwSortField(f);setHwSortDir("asc");} };

  const saveHwForm = async () => {
    if (!hwForm.tipo||!hwForm.seriale) { showToast("Tipo e Seriale obbligatori","error"); return; }
    if (hardware.some(h=>h.seriale===hwForm.seriale&&h.id!==hwEditId)) { showToast("Seriale duplicato","error"); return; }
    const statoAuto = hwForm.assegnatoA ? "In uso" : (hwForm.stato==="In uso"?"Disponibile":hwForm.stato);
    const payload = {...hwForm,stato:statoAuto};
    try {
      if (hwEditId) {
        const { data, error } = await supabase.from("hardware").update(payload).eq("id",hwEditId).select().single();
        if (error) throw error;
        setHardware(prev=>prev.map(h=>h.id===hwEditId?data:h));
        if (data.tipo==="PC"&&data.assegnatoA) {
          await supabase.from("assets").update({serialePC:data.seriale,modelloPC:`${data.marca} ${data.modello}`.trim()}).eq("nominativo",data.assegnatoA);
          setAssets(prev=>prev.map(a=>a.nominativo===data.assegnatoA?{...a,serialePC:data.seriale,modelloPC:`${data.marca} ${data.modello}`.trim()}:a));
        }
        const old = hardware.find(h=>h.id===hwEditId);
        if (old?.tipo==="PC"&&old.assegnatoA&&old.assegnatoA!==data.assegnatoA) {
          await supabase.from("assets").update({serialePC:"",modelloPC:""}).eq("nominativo",old.assegnatoA).eq("serialePC",old.seriale);
          setAssets(prev=>prev.map(a=>a.nominativo===old.assegnatoA&&a.serialePC===old.seriale?{...a,serialePC:"",modelloPC:""}:a));
        }
        showToast("Hardware aggiornato!");
      } else {
        const { data, error } = await supabase.from("hardware").insert(payload).select().single();
        if (error) throw error;
        setHardware(prev=>[...prev,data]);
        if (data.tipo==="PC"&&data.assegnatoA) {
          await supabase.from("assets").update({serialePC:data.seriale,modelloPC:`${data.marca} ${data.modello}`.trim()}).eq("nominativo",data.assegnatoA);
          setAssets(prev=>prev.map(a=>a.nominativo===data.assegnatoA?{...a,serialePC:data.seriale,modelloPC:`${data.marca} ${data.modello}`.trim()}:a));
        }
        showToast("Hardware aggiunto!");
      }
      setHwView("table"); setHwEditId(null); setHwForm(emptyHwForm);
    } catch (err) { showToast("Errore: "+err.message,"error"); }
  };

  const doDeleteHw = async (id) => {
    try {
      const { error } = await supabase.from("hardware").delete().eq("id",id);
      if (error) throw error;
      setHardware(prev=>prev.filter(h=>h.id!==id));
      setHwDeleteConfirm(null);
      showToast("Hardware eliminato","info");
    } catch (err) { showToast("Errore: "+err.message,"error"); }
  };

  // ── import ──
  const dlTemplate = async () => {
    const XLSX = await loadXLSX();
    const ws = XLSX.utils.aoa_to_sheet([CSV_HEADERS, CSV_COLUMNS.map(()=>"")]);
    ws["!cols"] = CSV_HEADERS.map(h=>({wch:Math.max(h.length+4,16)}));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,"Asset");
    XLSX.writeFile(wb,"template-import.xlsx");
  };
  const handleFile = async (e) => {
    const f=e.target.files[0]; if(!f) return; e.target.value="";
    try { setImportData(await parseXLSX(f)); } catch(err) { setImportData({records:[],errors:["Errore: "+err.message]}); }
  };
  const confirmImport = async () => {
    if (!importData||!importData.records.length) return;
    try {
      if (importMode==="sostituisci") { await supabase.from("assets").delete().neq("id",0); setAssets([]); }
      const toInsert = importData.records.map(r=>({nominativo:r.nominativo,email:r.email,reparto:r.reparto,serialePC:r.serialePC,modelloPC:r.modelloPC,dataAcquisto:r.dataAcquisto,dataConsegna:r.dataConsegna,sim:r.sim,numeroCellulare:r.numeroCellulare,accountMicrosoft:r.accountMicrosoft,note:r.note,stato:r.stato}));
      const { data, error } = await supabase.from("assets").insert(toInsert).select();
      if (error) throw error;
      setAssets(prev=>importMode==="sostituisci"?data:[...prev,...data]);
      const hi = {ts:new Date().toISOString(),action:importMode==="sostituisci"?"IMPORTAZIONE_COMPLETA":"IMPORTAZIONE",asset_id:null,asset_serial:null,asset_nome:`${data.length} asset`,changes:null};
      const { data:hd } = await supabase.from("history").insert(hi).select().single();
      if (hd) setHistory(prev=>[hd,...prev]);
      showToast(`${data.length} asset importati!`);
      setImportData(null); setView("table");
    } catch(err) { showToast("Errore importazione: "+err.message,"error"); }
  };

  const exportCSV = () => { downloadFile(toCSV(filtered),"asset-export.csv","text/csv;charset=utf-8"); showToast(`CSV esportato (${filtered.length} record)`); };
  const exportXLS = () => { exportToXLSX(filtered,"asset-export.xlsx").then(()=>showToast(`Excel esportato (${filtered.length} record)`)).catch(e=>showToast("Errore: "+e.message,"error")); };

  const SortIcon = ({field}) => <span style={{opacity:sortField===field?1:0.3,marginLeft:4,fontSize:10}}>{sortField===field&&sortDir==="desc"?"▼":"▲"}</span>;
  const detailAsset = assets.find(a=>a.id===detailId);
  const ActionBadge = ({action}) => {
    const map={CREATO:["#22c55e","✦"],MODIFICATO:["#f59e0b","✎"],ELIMINATO:["#ef4444","✕"],IMPORTAZIONE:["#1f6feb","⬆"],IMPORTAZIONE_COMPLETA:["#8b5cf6","⬆"]};
    const [color,icon]=map[action]||["#888","·"];
    return <span style={{display:"inline-flex",alignItems:"center",gap:4,background:color+"22",color,border:`1px solid ${color}44`,borderRadius:20,padding:"2px 9px",fontSize:11,fontWeight:500,whiteSpace:"nowrap"}}>{icon} {action.replace(/_/g," ")}</span>;
  };

  // ── loading / error ──
  if (loading) return (
    <div style={{fontFamily:"'Inter',sans-serif",background:"#131929",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",color:"#dde5f5"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:40,marginBottom:16}}>⏳</div>
        <div style={{fontSize:16,fontWeight:500}}>Caricamento dati dal database...</div>
        <div style={{fontSize:13,color:"#7f90b8",marginTop:8}}>Connessione a Supabase in corso</div>
      </div>
    </div>
  );

  if (dbError) return (
    <div style={{fontFamily:"'Inter',sans-serif",background:"#131929",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",color:"#dde5f5"}}>
      <div style={{textAlign:"center",maxWidth:500,padding:32}}>
        <div style={{fontSize:48,marginBottom:16}}>⚠️</div>
        <div style={{fontSize:18,fontWeight:600,marginBottom:12}}>Errore connessione database</div>
        <div style={{fontSize:13,color:"#f85149",background:"#da363322",border:"1px solid #da363344",borderRadius:8,padding:"12px 16px",marginBottom:20,textAlign:"left",fontFamily:"monospace"}}>{dbError}</div>
        <div style={{fontSize:13,color:"#7f90b8",marginBottom:20,textAlign:"left",lineHeight:1.9}}>
          Verifica che le variabili d'ambiente siano configurate correttamente nel file <code style={{color:"#82aaff"}}>.env</code> (o in Netlify):<br/>
          <code style={{color:"#82aaff"}}>VITE_SUPABASE_URL</code><br/>
          <code style={{color:"#82aaff"}}>VITE_SUPABASE_ANON_KEY</code><br/><br/>
          Poi esegui lo script <code style={{color:"#82aaff"}}>supabase_schema.sql</code> nel tuo progetto Supabase.
        </div>
        <button onClick={()=>window.location.reload()} style={{background:"#1f6feb",color:"#fff",border:"none",borderRadius:8,padding:"10px 24px",fontSize:14,cursor:"pointer"}}>↺ Riprova</button>
      </div>
    </div>
  );

  // ── render ──
  return (
    <div style={{fontFamily:"'Inter','JetBrains Mono',sans-serif",background:T.bg,minHeight:"100vh",color:T.text,transition:"background .2s,color .2s"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:6px;height:6px}
        ::-webkit-scrollbar-track{background:${T.scrollTr}}
        ::-webkit-scrollbar-thumb{background:${T.scrollTh};border-radius:3px}
        input,select,textarea{outline:none;transition:border .15s,background .2s,color .2s}
        .btn{cursor:pointer;border:none;border-radius:6px;font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:500;padding:8px 16px;transition:all .15s}
        .btn-primary{background:#238636;color:#fff}.btn-primary:hover{background:#2ea043}
        .btn-danger{background:#da3633;color:#fff}.btn-danger:hover{background:#f85149}
        .btn-ghost{background:transparent;color:${T.textSub};border:1px solid ${T.border2}}.btn-ghost:hover{background:${T.hover};color:${T.text}}
        .btn-accent{background:#1f6feb;color:#fff}.btn-accent:hover{background:#388bfd}
        .btn-purple{background:#6e40c9;color:#fff}.btn-purple:hover{background:#8957e5}
        .fi{display:flex;flex-direction:column;gap:6px}
        .fl{font-size:11px;color:${T.textSub};text-transform:uppercase;letter-spacing:.08em}
        .fi2{background:${T.inputBg};border:1px solid ${T.border2};border-radius:6px;color:${T.text};font-family:'JetBrains Mono',monospace;font-size:13px;padding:9px 12px;width:100%}
        .fi2:focus{border-color:#388bfd}
        .fi2::placeholder{color:${T.textMuted}}
        select.fi2 option{background:${T.selectBg};color:${T.text}}
        .th{cursor:pointer;user-select:none;white-space:nowrap}.th:hover{color:${T.link}}
        .rh:hover{background:${T.hover}!important}
        .badge{display:inline-block;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:500}
        .tag{display:inline-block;background:${T.surface2};border:1px solid ${T.border};border-radius:4px;padding:2px 8px;font-size:11px;color:${T.textSub}}
        .ntab{cursor:pointer;padding:8px 16px;border-radius:6px;font-size:13px;color:${T.textSub};transition:all .15s;border:none;background:transparent;font-family:'JetBrains Mono',monospace;white-space:nowrap}
        .ntab:hover{color:${T.text};background:${T.tabOn}}
        .ntab.on{color:${T.text};background:${T.tabOn};border-bottom:2px solid #1f6feb}
        .dz{border:2px dashed ${T.border2};border-radius:10px;padding:40px;text-align:center;cursor:pointer;transition:all .2s}
        .dz:hover{border-color:#1f6feb;background:#1f6feb0a}
        @keyframes si{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .ai{animation:si .2s ease}
      `}</style>

      {/* HW DELETE MODAL */}
      {hwDeleteConfirm&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:998,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{background:T.surface,border:`1px solid ${T.border2}`,borderRadius:12,padding:32,width:360,textAlign:"center"}}><div style={{fontSize:36,marginBottom:12}}>⚠️</div><div style={{fontWeight:600,fontSize:15,color:T.text,marginBottom:8}}>Eliminare questo hardware?</div><div style={{color:T.textSub,fontSize:13,marginBottom:24}}>Operazione non reversibile.</div><div style={{display:"flex",gap:10,justifyContent:"center"}}><button className="btn btn-ghost" onClick={()=>setHwDeleteConfirm(null)}>Annulla</button><button className="btn btn-danger" onClick={()=>doDeleteHw(hwDeleteConfirm)}>Elimina</button></div></div></div>}

      {/* TOAST */}
      {toast&&<div style={{position:"fixed",top:20,right:20,zIndex:999,background:toast.type==="error"?"#da3633":toast.type==="info"?"#1f6feb":"#238636",color:"#fff",borderRadius:8,padding:"12px 20px",fontSize:13,boxShadow:"0 8px 24px rgba(0,0,0,.3)",maxWidth:340}}>{toast.msg}</div>}

      {/* DELETE MODAL */}
      {deleteConfirm&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:998,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{background:T.surface,border:`1px solid ${T.border2}`,borderRadius:12,padding:32,width:360,textAlign:"center"}}><div style={{fontSize:36,marginBottom:12}}>⚠️</div><div style={{fontWeight:600,fontSize:15,color:T.text,marginBottom:8}}>Eliminare questo asset?</div><div style={{color:T.textSub,fontSize:13,marginBottom:24}}>L'operazione verrà registrata nello storico.</div><div style={{display:"flex",gap:10,justifyContent:"center"}}><button className="btn btn-ghost" onClick={()=>setDeleteConfirm(null)}>Annulla</button><button className="btn btn-danger" onClick={doDelete}>Elimina</button></div></div></div>}

      {/* REPARTI MODAL */}
      {showRepartiManager&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:998,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowRepartiManager(false)}><div style={{background:T.surface,border:`1px solid ${T.border2}`,borderRadius:12,padding:28,width:440,maxHeight:"80vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}><div style={{display:"flex",alignItems:"center",marginBottom:20}}><div style={{fontWeight:600,fontSize:16,color:T.text}}>⚙ Gestisci Ruoli</div><div style={{flex:1}}/><button className="btn btn-ghost" style={{padding:"4px 10px",fontSize:12}} onClick={()=>setShowRepartiManager(false)}>✕</button></div><div style={{display:"flex",gap:6,marginBottom:16}}><input className="fi2" placeholder="Nome nuovo ruolo..." value={newReparto} onChange={e=>setNewReparto(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&newReparto.trim()){addReparto(newReparto.trim());setNewReparto("");}}} style={{flex:1}}/><button className="btn btn-primary" style={{padding:"5px 12px",fontSize:12}} onClick={()=>{addReparto(newReparto.trim());setNewReparto("");}}>+ Aggiungi</button></div><div style={{display:"flex",flexDirection:"column",gap:6}}>{reparti.map(r=><div key={r} style={{display:"flex",alignItems:"center",background:T.surface2,borderRadius:6,padding:"8px 12px",border:`1px solid ${T.border}`}}><span style={{flex:1,fontSize:13,color:T.text}}>{r}</span><button onClick={()=>removeReparto(r)} style={{background:"transparent",border:"none",color:"#ef4444",cursor:"pointer",fontSize:14}}>🗑</button></div>)}</div></div></div>}

      {/* HEADER */}
      <div style={{borderBottom:`1px solid ${T.border}`,padding:"12px 24px",display:"flex",alignItems:"center",gap:12,background:T.surface,flexWrap:"wrap"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
            <img src={HILI_LOGO} alt="Hili Asset Manager" style={{height:44,objectFit:"contain",filter:theme==="light"?"brightness(0) saturate(0)":"none"}}/>
        </div>
        <div style={{display:"flex",gap:2,marginLeft:16}}>
          {[["table","📦 Asset"],["hardware","🖥 Hardware"],["history","🕓 Storico"],["import","⬆ Importa"]].map(([v,l])=>(
            <button key={v} className={`ntab${view===v?" on":""}`} onClick={()=>setView(v)}>{l}</button>
          ))}
        </div>
        <div style={{flex:1}}/>
        <div style={{display:"flex",gap:14,fontSize:12,color:T.textSub}}>
          <span>📦 <b style={{color:T.text}}>{assets.length}</b> totali</span>
          <span>✅ <b style={{color:"#22c55e"}}>{assets.filter(a=>a.stato==="Attivo").length}</b> attivi</span>
        </div>
        <div style={{display:"flex",gap:2,background:T.surface2,borderRadius:12,padding:3,border:`1px solid ${T.border}`}}>
          {["black","dark","light"].map((t,i)=>(
            <button key={t} onClick={()=>setTheme(t)} style={{background:theme===t?T.accent:"transparent",border:"none",borderRadius:9,padding:"5px 11px",cursor:"pointer",fontSize:13,color:theme===t?"#fff":T.textMuted}}>{["⬛","🌙","☀️"][i]}</button>
          ))}
        </div>
        <button className="btn btn-primary" onClick={openNew}>+ Nuovo Asset</button>
      </div>

      <div style={{padding:"24px 20px 48px",maxWidth:1800,margin:"0 auto"}}>

        {/* TABLE */}
        {view==="table"&&<div className="ai">
          {showColManager&&<div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:20,marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",marginBottom:14}}>
              <div style={{fontWeight:600,fontSize:14,color:T.text}}>⚙ Gestisci colonne</div><div style={{flex:1}}/>
              <div style={{fontSize:12,color:T.textSub,marginRight:16}}>Trascina per riordinare · Spunta per mostrare/nascondere</div>
              <button className="btn btn-ghost" style={{padding:"4px 10px",fontSize:12}} onClick={()=>{setVisibleCols(ALL_COLUMNS.map(c=>c.key));setColOrder(ALL_COLUMNS.map(c=>c.key));}}>Ripristina</button>
              <button className="btn btn-ghost" style={{padding:"4px 10px",fontSize:12,marginLeft:6}} onClick={()=>setShowColManager(false)}>✕</button>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {colOrder.map(key=>{
                const col=ALL_COLUMNS.find(c=>c.key===key); if(!col) return null;
                const iv=visibleCols.includes(key), id=dragCol===key, io=dragOver===key;
                return <div key={key} draggable onDragStart={()=>setDragCol(key)} onDragOver={e=>{e.preventDefault();setDragOver(key);}} onDragEnd={()=>{if(dragCol&&dragOver&&dragCol!==dragOver){setColOrder(prev=>{const a=[...prev];const fi=a.indexOf(dragCol);const ti=a.indexOf(dragOver);a.splice(fi,1);a.splice(ti,0,dragCol);return a;});}setDragCol(null);setDragOver(null);}} onClick={()=>{if(col.always)return;setVisibleCols(prev=>prev.includes(key)?prev.filter(k=>k!==key):[...prev,key]);}} style={{display:"flex",alignItems:"center",gap:8,background:io&&!id?"#1f6feb22":iv?T.surface2:T.bg,border:`1px solid ${io&&!id?"#1f6feb":iv?T.border:T.border2}`,borderRadius:8,padding:"7px 12px",cursor:col.always?"default":"pointer",opacity:id?0.4:1,userSelect:"none"}}>
                  <span style={{fontSize:13,cursor:"grab",color:T.textMuted}}>⠿</span>
                  <span style={{width:14,height:14,borderRadius:4,border:`2px solid ${iv?"#1f6feb":T.border2}`,background:iv?"#1f6feb":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{iv&&<span style={{color:"#fff",fontSize:9,fontWeight:700}}>✓</span>}</span>
                  <span style={{fontSize:13,color:iv?T.text:T.textMuted,fontWeight:iv?500:400}}>{col.label}</span>
                  {col.always&&<span style={{fontSize:10,color:T.textMuted,border:`1px solid ${T.border}`,borderRadius:3,padding:"0 4px"}}>fisso</span>}
                </div>;
              })}
            </div>
          </div>}

          <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap",alignItems:"center",paddingBottom:16,borderBottom:`2px solid ${T.border2}`}}>
            <input className="fi2" placeholder="🔍  Cerca nominativo, seriale, SIM, numero, modello..." value={search} onChange={e=>setSearch(e.target.value)} style={{flex:1,minWidth:220}}/>
            <select className="fi2" value={filterReparto} onChange={e=>setFilterReparto(e.target.value)} style={{width:185}}><option value="Tutti">Tutti i ruoli</option>{reparti.map(r=><option key={r}>{r}</option>)}</select>
            <select className="fi2" value={filterStato} onChange={e=>setFilterStato(e.target.value)} style={{width:165}}><option value="Tutti">Tutti gli stati</option>{stati.map(s=><option key={s}>{s}</option>)}</select>
            {(search||filterReparto!=="Tutti"||filterStato!=="Tutti")&&<button className="btn btn-ghost" onClick={()=>{setSearch("");setFilterReparto("Tutti");setFilterStato("Tutti");}}>✕ Reset</button>}
            <div style={{display:"flex",gap:6,marginLeft:"auto"}}>
              <button className="btn btn-ghost" onClick={()=>setShowColManager(v=>!v)} style={{display:"flex",alignItems:"center",gap:6,borderColor:showColManager?"#1f6feb":undefined,color:showColManager?"#1f6feb":undefined}}>⊞ Colonne <span style={{background:T.surface2,borderRadius:10,padding:"1px 6px",fontSize:11}}>{visibleCols.length}</span></button>
              <button className="btn btn-purple" onClick={exportXLS}>⬇ Excel</button>
            </div>
          </div>

          {(()=>{
            const activeCols=colOrder.filter(k=>visibleCols.includes(k)).map(k=>ALL_COLUMNS.find(c=>c.key===k)).filter(Boolean);
            const startResize=(e,key)=>{e.preventDefault();e.stopPropagation();const thEl=e.currentTarget.parentElement;resizingCol.current=key;resizingStartX.current=e.clientX;resizingStartW.current=colWidths[key]||thEl.offsetWidth;document.body.style.cursor="col-resize";document.body.style.userSelect="none";const onMove=(ev)=>{const delta=ev.clientX-resizingStartX.current;const nw=Math.max(60,resizingStartW.current+delta);setColWidths(prev=>({...prev,[resizingCol.current]:nw}));};const onUp=()=>{resizingCol.current=null;document.body.style.cursor="";document.body.style.userSelect="";window.removeEventListener("mousemove",onMove);window.removeEventListener("mouseup",onUp);};window.addEventListener("mousemove",onMove);window.addEventListener("mouseup",onUp);};
            const renderCell=(a,key,w)=>{
              const cs={padding:"11px 14px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:w||undefined};
              switch(key){
                case "nominativo": return <td key={key} style={{...cs,maxWidth:w||220}}><div style={{fontWeight:500,fontSize:13,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.nominativo}</div><div style={{fontSize:11,color:T.textSub,overflow:"hidden",textOverflow:"ellipsis",marginTop:2}}>{a.email}</div></td>;
                case "email": return <td key={key} style={{...cs,color:T.textSub,fontSize:12}}>{a.email||"—"}</td>;
                case "reparto": return <td key={key} style={cs}><span className="tag">{a.reparto||"—"}</span></td>;
                case "serialePC": return <td key={key} style={{...cs,fontWeight:500,color:T.link}}>{a.serialePC||"—"}</td>;
                case "modelloPC": return <td key={key} style={{...cs,color:T.textSub,fontSize:12}}>{a.modelloPC||"—"}</td>;
                case "dataAcquisto": return <td key={key} style={{...cs,color:T.textSub,fontSize:12}}>{fmtDate(a.dataAcquisto)}</td>;
                case "dataConsegna": return <td key={key} style={{...cs,color:T.textSub,fontSize:12}}>{fmtDate(a.dataConsegna)}</td>;
                case "numeroCellulare": return <td key={key} style={{...cs,color:T.text}}>{a.numeroCellulare||"—"}</td>;
                case "sim": return <td key={key} style={{...cs,color:T.textSub,fontSize:12}}>{a.sim||"—"}</td>;
                case "accountMicrosoft": return <td key={key} style={{...cs,color:T.textSub,fontSize:12}}>{a.accountMicrosoft||"—"}</td>;
                case "note": return <td key={key} style={{...cs,color:T.textSub,fontSize:12}}>{a.note||"—"}</td>;
                case "stato": return <td key={key} style={cs}><span className="badge" style={{background:statoColor(a.stato)+"22",color:statoColor(a.stato),border:`1px solid ${statoColor(a.stato)}44`}}>{a.stato}</span></td>;
                case "hardware":{
                  const ti={"PC":"🖥","Monitor":"🖥","Telefono":"📱","SIM":"📡","Cuffie":"🎧","Altro":"📦"};
                  const ass=hardware.filter(h=>h.assegnatoA&&h.assegnatoA.toLowerCase()===a.nominativo.toLowerCase());
                  return <td key={key} style={{...cs,maxWidth:w||200}}>{ass.length===0?<span style={{color:T.textMuted,fontSize:12}}>—</span>:<div style={{display:"flex",flexWrap:"wrap",gap:4}}>{ass.map(h=><span key={h.id} title={`${h.marca} ${h.modello} · ${h.seriale}`} style={{display:"inline-flex",alignItems:"center",gap:3,background:T.surface2,border:`1px solid ${T.border}`,borderRadius:4,padding:"2px 6px",fontSize:11,color:T.textSub,whiteSpace:"nowrap"}}>{ti[h.tipo]||"📦"} {h.tipo}</span>)}</div>}</td>;
                }
                default: return <td key={key} style={{...cs,color:T.textSub,fontSize:12}}>{a[key]||"—"}</td>;
              }
            };
            return <div style={{background:T.surface,borderRadius:14,border:`3px solid ${T.border2}`,overflow:"hidden",boxShadow:`0 4px 20px rgba(0,0,0,0.25)`}}>
              <div style={{overflowX:"auto"}} ref={tableRef}>
                <table style={{tableLayout:"fixed",borderCollapse:"collapse",fontSize:13,minWidth:"100%"}}>
                  <colgroup>{activeCols.map(col=><col key={col.key} style={{width:colWidths[col.key]?colWidths[col.key]+"px":undefined}}/>)}<col style={{width:"120px"}}/><col style={{width:"120px"}}/></colgroup>
                  <thead><tr style={{background:T.surface2,borderBottom:`3px solid ${T.border2}`}}>
                    {activeCols.map(col=><th key={col.key} className="th" style={{padding:"10px 14px",textAlign:"left",color:T.textSub,fontWeight:500,fontSize:11,textTransform:"uppercase",letterSpacing:"0.07em",position:"relative",whiteSpace:"nowrap",width:colWidths[col.key]||undefined}}>
                      <span onClick={()=>sortBy(col.key)} style={{display:"inline-flex",alignItems:"center",gap:2,cursor:"pointer"}}>{col.label}<SortIcon field={col.key}/></span>
                      <span onMouseDown={e=>startResize(e,col.key)} style={{position:"absolute",top:0,right:0,width:6,height:"100%",cursor:"col-resize",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2}} onMouseEnter={e=>e.currentTarget.style.background="#1f6feb55"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}><span style={{width:2,height:"60%",background:"currentColor",borderRadius:1,opacity:0.4,pointerEvents:"none"}}/></span>
                    </th>)}
                    <th style={{padding:"10px 14px",color:T.textSub,fontSize:11,textTransform:"uppercase",whiteSpace:"nowrap",minWidth:220}}>
                      <div style={{display:"flex",gap:4,alignItems:"center"}}>{checkLabels.map((lbl,i)=><div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",minWidth:70}}>{editingLabel===i?<input autoFocus defaultValue={lbl} onBlur={e=>{saveCheckLabel(i,e.target.value.trim()||lbl);setEditingLabel(null);}} onKeyDown={e=>{if(e.key==="Enter")e.target.blur();if(e.key==="Escape")setEditingLabel(null);}} style={{width:70,fontSize:10,background:T.inputBg,border:`1px solid ${T.border2}`,borderRadius:4,color:T.text,padding:"2px 4px",textAlign:"center"}}/>:<span onClick={()=>setEditingLabel(i)} title="Clicca per rinominare" style={{fontSize:10,color:T.textSub,cursor:"pointer",textAlign:"center",whiteSpace:"nowrap",borderBottom:`1px dashed ${T.border2}`}}>{lbl}</span>}</div>)}</div>
                    </th>
                    <th style={{padding:"10px 14px",color:T.textSub,fontSize:11,textTransform:"uppercase"}}>Azioni</th>
                  </tr></thead>
                  <tbody>
                    {filtered.length===0?<tr><td colSpan={activeCols.length+2} style={{padding:"48px 0",textAlign:"center",color:T.textMuted}}>Nessun asset trovato</td></tr>
                    :filtered.map((a,i)=><tr key={a.id} className="rh" style={{borderBottom:`1px solid ${T.border2}`,background:i%2===0?"transparent":T.surface2}}>
                      {activeCols.map(col=>renderCell(a,col.key,colWidths[col.key]))}
                      <td style={{padding:"11px 14px"}}><div style={{display:"flex",gap:4,alignItems:"center"}}>{checkLabels.map((_,idx)=><div key={idx} style={{display:"flex",flexDirection:"column",alignItems:"center",minWidth:70}}><div onClick={()=>toggleCheck(a.id,idx)} style={{width:20,height:20,borderRadius:5,cursor:"pointer",border:`2px solid ${getCheck(a.id,idx)?"#22c55e":T.border2}`,background:getCheck(a.id,idx)?"#22c55e":"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s"}}>{getCheck(a.id,idx)&&<span style={{color:"#fff",fontSize:12,fontWeight:700}}>✓</span>}</div></div>)}</div></td>
                      <td style={{padding:"11px 14px"}}><div style={{display:"flex",gap:6}}>
                        <button onClick={()=>openDetail(a)} style={{padding:"5px 10px",fontSize:12,background:"#d29922",border:"none",borderRadius:6,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background="#e3b341"} onMouseLeave={e=>e.currentTarget.style.background="#d29922"}>👁</button>
                        <button className="btn btn-accent" onClick={()=>openEdit(a)} style={{padding:"5px 10px",fontSize:12}}>✏️</button>
                        <button className="btn btn-danger" onClick={()=>setDeleteConfirm(a.id)} style={{padding:"5px 10px",fontSize:12}}>🗑</button>
                      </div></td>
                    </tr>)}
                  </tbody>
                </table>
              </div>
              <div style={{padding:"10px 16px",borderTop:`3px solid ${T.border2}`,fontSize:12,color:T.textSub,display:"flex",gap:16,flexWrap:"wrap",alignItems:"center"}}>
                <span>{filtered.length} di {assets.length} record · {activeCols.length} colonne visibili</span>
                {filtered.length<assets.length&&<span style={{color:"#f59e0b"}}>⚠ Filtri attivi — esportazione parziale</span>}
                {Object.keys(colWidths).length>0&&<button className="btn btn-ghost" style={{padding:"2px 8px",fontSize:11,marginLeft:"auto"}} onClick={()=>setColWidths({})}>↺ Reset larghezze</button>}
              </div>
            </div>;
          })()}
        </div>}

        {/* FORM */}
        {view==="form"&&<div className="ai">
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
            <button className="btn btn-ghost" onClick={()=>setView(prevView)} style={{padding:"6px 12px"}}>← Indietro</button>
            <h2 style={{fontWeight:600,fontSize:18,color:T.text}}>{editId?"Modifica Asset":"Nuovo Asset"}</h2>
          </div>
          <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,padding:28,maxWidth:900}}>
            {[
              {icon:"👤",title:"Dati Dipendente",grid:"1fr 1fr",fields:[["nominativo","Nominativo *","text","Nome Cognome"],["email","Email aziendale","email","nome@azienda.it"],["reparto","Ruolo","reparto",null],["accountMicrosoft","Account Microsoft 365","text","nome@azienda.onmicrosoft.com"]]},
              {icon:"📱",title:"Dati SIM / Telefono",grid:"1fr 1fr",fields:[["sim","Codice SIM","text","SIM-IT-XXX"],["numeroCellulare","Numero Cellulare","text","+39 3XX XXXXXXX"]]},
            ].map(({icon,title,grid,fields})=>(
              <div key={title} style={{marginBottom:28}}>
                <div style={{fontSize:12,color:T.textSub,fontWeight:600,marginBottom:16,paddingBottom:8,borderBottom:`1px solid ${T.border}`}}>{icon} {title}</div>
                <div style={{display:"grid",gridTemplateColumns:grid,gap:16}}>
                  {fields.map(([key,label,type,ph])=>(
                    <div key={key} className="fi">
                      <label className="fl">{label}</label>
                      {type==="reparto"?(
                        <div>
                          <select className="fi2" value={form.reparto} onChange={e=>setForm({...form,reparto:e.target.value})} style={{marginBottom:6}}><option value="">— Seleziona —</option>{reparti.map(r=><option key={r}>{r}</option>)}</select>
                          {!showAddReparto?(
                            <div style={{display:"flex",gap:6}}>
                              <button type="button" onClick={()=>setShowAddReparto(true)} style={{background:"transparent",border:`1px dashed ${T.border2}`,borderRadius:6,color:T.textSub,fontSize:12,padding:"5px 10px",cursor:"pointer",flex:1}}>+ Aggiungi nuovo ruolo</button>
                              <button type="button" onClick={()=>setShowRepartiManager(true)} style={{background:"transparent",border:`1px solid ${T.border2}`,borderRadius:6,color:T.textMuted,fontSize:11,padding:"5px 9px",cursor:"pointer"}} title="Gestisci ruoli">⚙</button>
                            </div>
                          ):(
                            <div style={{display:"flex",gap:6}}>
                              <input className="fi2" placeholder="Nome ruolo..." value={newReparto} onChange={e=>setNewReparto(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&newReparto.trim()){addReparto(newReparto.trim());setForm(f=>({...f,reparto:newReparto.trim()}));setNewReparto("");setShowAddReparto(false);}if(e.key==="Escape"){setShowAddReparto(false);setNewReparto("");}}} style={{flex:1}} autoFocus/>
                              <button type="button" className="btn btn-primary" style={{padding:"5px 10px",fontSize:12}} onClick={()=>{if(newReparto.trim()){addReparto(newReparto.trim());setForm(f=>({...f,reparto:newReparto.trim()}));setNewReparto("");setShowAddReparto(false);}}}>✓</button>
                              <button type="button" className="btn btn-ghost" style={{padding:"5px 10px",fontSize:12}} onClick={()=>{setShowAddReparto(false);setNewReparto("");}}>✕</button>
                            </div>
                          )}
                        </div>
                      ):<input className="fi2" type={type} placeholder={ph} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}/>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {(()=>{
              const pc=hardware.find(h=>h.tipo==="PC"&&h.assegnatoA===form.nominativo);
              return <div style={{marginBottom:28}}>
                <div style={{fontSize:12,color:T.textSub,fontWeight:600,marginBottom:16,paddingBottom:8,borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <span>🖥️ Dati PC</span>
                  {!pc&&<span style={{fontSize:11,color:T.textMuted,fontWeight:400}}>Assegna un PC dalla sezione Hardware</span>}
                </div>
                {pc?<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>{[["Seriale PC",pc.seriale],["Modello",`${pc.marca} ${pc.modello}`.trim()],["Marca",pc.marca],["Stato HW",pc.stato]].map(([k,v])=><div key={k} style={{background:T.surface2,border:`1px solid ${T.border}`,borderRadius:6,padding:"10px 14px"}}><div style={{fontSize:11,color:T.textMuted,marginBottom:4}}>{k}</div><div style={{fontSize:13,color:T.text,fontWeight:500}}>{v||"—"}</div></div>)}</div>
                :<div style={{background:T.surface2,border:`1px dashed ${T.border2}`,borderRadius:8,padding:"18px 16px",textAlign:"center",color:T.textMuted,fontSize:13}}>Nessun PC assegnato — vai in <b style={{color:T.textSub}}>🖥 Hardware</b></div>}
              </div>;
            })()}
            <div style={{marginBottom:28}}>
              <div style={{fontSize:12,color:T.textSub,fontWeight:600,marginBottom:16,paddingBottom:8,borderBottom:`1px solid ${T.border}`}}>📋 Stato & Note</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:16}}>
                <div className="fi"><label className="fl">Stato</label><select className="fi2" value={form.stato} onChange={e=>setForm({...form,stato:e.target.value})}>{stati.map(s=><option key={s}>{s}</option>)}</select></div>
                <div className="fi"><label className="fl">Note</label><textarea className="fi2" rows={2} placeholder="Note aggiuntive..." value={form.note} onChange={e=>setForm({...form,note:e.target.value})} style={{resize:"vertical"}}/></div>
              </div>
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
              <button className="btn btn-ghost" onClick={()=>setView(prevView)}>Annulla</button>
              <button className="btn btn-primary" onClick={saveForm}>💾 {editId?"Salva Modifiche":"Aggiungi Asset"}</button>
            </div>
          </div>
        </div>}

        {/* DETAIL */}
        {view==="detail"&&detailAsset&&<div className="ai">
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
            <button className="btn btn-ghost" onClick={()=>setView("table")} style={{padding:"6px 12px"}}>← Indietro</button>
            <h2 style={{fontWeight:600,fontSize:18,color:T.text}}>{detailAsset.nominativo}</h2>
            <span className="badge" style={{background:statoColor(detailAsset.stato)+"22",color:statoColor(detailAsset.stato),border:`1px solid ${statoColor(detailAsset.stato)}44`}}>{detailAsset.stato}</span>
            <div style={{flex:1}}/>
            <button className="btn btn-accent" onClick={()=>openEdit(detailAsset)}>✏️ Modifica</button>
            <button className="btn btn-danger" onClick={()=>setDeleteConfirm(detailAsset.id)}>🗑 Elimina</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,maxWidth:900,marginBottom:24}}>
            {[{icon:"👤",title:"Dipendente",rows:[["Nominativo",detailAsset.nominativo],["Email",detailAsset.email],["Ruolo",detailAsset.reparto],["Account M365",detailAsset.accountMicrosoft]]},{icon:"🖥️",title:"PC",rows:[["Seriale",detailAsset.serialePC],["Modello",detailAsset.modelloPC],["Data Acquisto",fmtDate(detailAsset.dataAcquisto)],["Data Consegna",fmtDate(detailAsset.dataConsegna)]]},{icon:"📱",title:"SIM / Telefono",rows:[["Codice SIM",detailAsset.sim],["Numero",detailAsset.numeroCellulare],["Note",detailAsset.note||"—"]]}].map(({icon,title,rows})=>(
              <div key={title} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:20}}>
                <div style={{fontSize:13,color:T.text,fontWeight:600,marginBottom:14}}>{icon} {title}</div>
                {rows.map(([k,v])=><div key={k} style={{marginBottom:12}}><div style={{fontSize:12,color:T.textSub,fontWeight:500,marginBottom:4}}>{k}</div><div style={{fontSize:14,color:(!v||v==="—")?T.textMuted:T.text,wordBreak:"break-all"}}>{v||"—"}</div></div>)}
              </div>
            ))}
          </div>
          {(()=>{
            const ah=history.filter(h=>h.asset_id===detailAsset.id);
            if(!ah.length) return null;
            return <div style={{maxWidth:900}}><div style={{fontSize:12,color:T.textSub,fontWeight:600,marginBottom:12}}>🕓 Storico di questo asset</div>
              <div style={{background:T.surface,border:`3px solid ${T.border2}`,borderRadius:10,overflow:"hidden",boxShadow:`0 4px 20px rgba(0,0,0,0.25)`}}>
                {ah.map((h,i)=><div key={h.id} style={{padding:"12px 16px",borderBottom:i<ah.length-1?`1px solid ${T.border}`:"none"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:parseChanges(h.changes)?.length?8:0}}><ActionBadge action={h.action}/><span style={{fontSize:12,color:T.textSub}}>{fmtTs(h.ts)}</span></div>
                  {parseChanges(h.changes)?.map((c,ci)=><div key={ci} style={{marginTop:4,fontSize:12,color:T.textSub,paddingLeft:8}}><span style={{color:T.textMuted}}>{c.field}: </span><span style={{color:"#ef4444"}}>{c.from||"(vuoto)"}</span><span style={{color:T.textMuted}}> → </span><span style={{color:"#22c55e"}}>{c.to||"(vuoto)"}</span></div>)}
                </div>)}
              </div>
            </div>;
          })()}
        </div>}

        {/* HARDWARE */}
        {view==="hardware"&&<div className="ai">
          {hwView==="table"?(
            <div>
              <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
                <input className="fi2" placeholder="🔍  Cerca tipo, marca, modello, seriale..." value={hwSearch} onChange={e=>setHwSearch(e.target.value)} style={{flex:1,minWidth:220}}/>
                {hwSearch&&<button className="btn btn-ghost" onClick={()=>setHwSearch("")}>✕ Reset</button>}
                <div style={{marginLeft:"auto",display:"flex",gap:8,fontSize:12,color:T.textSub,alignItems:"center"}}>
                  <span>🖥 <b style={{color:T.text}}>{hardware.length}</b> totali</span>
                  <span>✅ <b style={{color:"#22c55e"}}>{hardware.filter(h=>h.stato==="In uso").length}</b> in uso</span>
                  <span>📦 <b style={{color:"#58a6ff"}}>{hardware.filter(h=>h.stato==="Disponibile").length}</b> disponibili</span>
                </div>
                <button className="btn btn-primary" onClick={()=>{setHwForm(emptyHwForm);setHwEditId(null);setHwView("form");}}>+ Aggiungi</button>
              </div>
              <div style={{background:T.surface,borderRadius:14,border:`1px solid ${T.border}`,overflow:"hidden"}}>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                    <thead><tr style={{background:T.surface2,borderBottom:`3px solid ${T.border2}`}}>
                      {[["tipo","Tipo"],["marca","Marca"],["modello","Modello"],["seriale","Seriale"],["stato","Stato"],["assegnatoA","Assegnato a"],["note","Note"]].map(([f,l])=>(
                        <th key={f} onClick={()=>hwSortBy(f)} className="th" style={{padding:"10px 14px",textAlign:"left",color:T.textSub,fontWeight:500,fontSize:11,textTransform:"uppercase",letterSpacing:"0.07em"}}>
                          {l}<span style={{opacity:hwSortField===f?1:0.3,marginLeft:4,fontSize:10}}>{hwSortField===f&&hwSortDir==="desc"?"▼":"▲"}</span>
                        </th>
                      ))}
                      <th style={{padding:"10px 14px",color:T.textSub,fontSize:11,textTransform:"uppercase"}}>Azioni</th>
                    </tr></thead>
                    <tbody>
                      {hwFiltered.length===0?<tr><td colSpan={8} style={{padding:"48px 0",textAlign:"center",color:T.textMuted}}>Nessun hardware trovato</td></tr>
                      :hwFiltered.map((h,i)=>{
                        const ti={"PC":"🖥","Monitor":"🖥","Telefono":"📱","SIM":"📡","Cuffie":"🎧","Altro":"📦"}[h.tipo]||"📦";
                        const sc={"In uso":"#22c55e","Disponibile":"#1f6feb","In manutenzione":"#f59e0b","Dismesso":"#ef4444"}[h.stato]||"#888";
                        return <tr key={h.id} className="rh" style={{borderBottom:`1px solid ${T.border2}`,background:i%2===0?"transparent":T.surface2}}>
                          <td style={{padding:"11px 14px"}}><span style={{fontWeight:500,color:T.text}}>{ti} {h.tipo}</span></td>
                          <td style={{padding:"11px 14px",color:T.text}}>{h.marca||"—"}</td>
                          <td style={{padding:"11px 14px",color:T.textSub,fontSize:12}}>{h.modello||"—"}</td>
                          <td style={{padding:"11px 14px",fontWeight:500,color:T.link,fontSize:12}}>{h.seriale||"—"}</td>
                          <td style={{padding:"11px 14px"}}><span className="badge" style={{background:sc+"22",color:sc,border:`1px solid ${sc}44`}}>{h.stato}</span></td>
                          <td style={{padding:"11px 14px",color:T.textSub,fontSize:12}}>{h.assegnatoA||"—"}</td>
                          <td style={{padding:"11px 14px",color:T.textMuted,fontSize:12,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.note||"—"}</td>
                          <td style={{padding:"11px 14px"}}><div style={{display:"flex",gap:6}}>
                            <button className="btn btn-accent" onClick={()=>{setHwForm({...h});setHwEditId(h.id);setHwView("form");}} style={{padding:"5px 10px",fontSize:12}}>✏️</button>
                            <button className="btn btn-danger" onClick={()=>setHwDeleteConfirm(h.id)} style={{padding:"5px 10px",fontSize:12}}>🗑</button>
                          </div></td>
                        </tr>;
                      })}
                    </tbody>
                  </table>
                </div>
                <div style={{padding:"10px 16px",borderTop:`3px solid ${T.border2}`,fontSize:12,color:T.textSub}}>{hwFiltered.length} di {hardware.length} record</div>
              </div>
            </div>
          ):(
            <div>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
                <button className="btn btn-ghost" onClick={()=>{setHwView("table");setHwEditId(null);setHwForm(emptyHwForm);}} style={{padding:"6px 12px"}}>← Indietro</button>
                <h2 style={{fontWeight:600,fontSize:18,color:T.text}}>{hwEditId?"Modifica Hardware":"Nuovo Hardware"}</h2>
              </div>
              <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,padding:28,maxWidth:700}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
                  {[["tipo","Tipo *","select"],["marca","Marca","text"],["modello","Modello","text"],["seriale","Seriale *","text"],["stato","Stato","select2"],["assegnatoA","Assegnato a","select3"]].map(([key,label,type])=>(
                    <div key={key} className="fi"><label className="fl">{label}</label>
                      {type==="select"?<select className="fi2" value={hwForm[key]} onChange={e=>setHwForm({...hwForm,[key]:e.target.value})}><option value="">— Seleziona —</option>{HW_TIPI.map(t=><option key={t}>{t}</option>)}</select>
                      :type==="select2"?<select className="fi2" value={hwForm[key]} onChange={e=>setHwForm({...hwForm,[key]:e.target.value})}>{HW_STATI.map(s=><option key={s}>{s}</option>)}</select>
                      :type==="select3"?<select className="fi2" value={hwForm[key]} onChange={e=>{const n=e.target.value;setHwForm(prev=>({...prev,[key]:n,stato:n?"In uso":(prev.stato==="In uso"?"Disponibile":prev.stato)}));}}><option value="">— Nessuno —</option>{[...assets].sort((a,b)=>a.nominativo.localeCompare(b.nominativo)).map(a=><option key={a.id} value={a.nominativo}>{a.nominativo}</option>)}</select>
                      :<input className="fi2" type="text" placeholder={label} value={hwForm[key]} onChange={e=>setHwForm({...hwForm,[key]:e.target.value})}/>}
                    </div>
                  ))}
                </div>
                <div className="fi" style={{marginBottom:24}}><label className="fl">Note</label><textarea className="fi2" rows={2} placeholder="Note aggiuntive..." value={hwForm.note} onChange={e=>setHwForm({...hwForm,note:e.target.value})} style={{resize:"vertical"}}/></div>
                <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                  <button className="btn btn-ghost" onClick={()=>{setHwView("table");setHwEditId(null);setHwForm(emptyHwForm);}}>Annulla</button>
                  <button className="btn btn-primary" onClick={saveHwForm}>💾 {hwEditId?"Salva Modifiche":"Aggiungi Hardware"}</button>
                </div>
              </div>
            </div>
          )}
        </div>}

        {/* HISTORY */}
        {view==="history"&&<div className="ai">
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20,flexWrap:"wrap"}}>
            <h2 style={{fontWeight:600,fontSize:18,color:T.text}}>🕓 Storico Modifiche</h2>
            <span style={{fontSize:12,color:T.textSub}}>{history.length} eventi</span>
            <div style={{flex:1}}/>
            <button className="btn btn-ghost" style={{fontSize:12,padding:"6px 12px"}} onClick={async()=>{await reloadHistory();showToast("Storico aggiornato");}}>↺ Aggiorna</button>
            <input className="fi2" placeholder="Filtra per nome, seriale, azione..." value={historySearch} onChange={e=>setHistorySearch(e.target.value)} style={{width:310}}/>
          </div>
          <div style={{background:T.surface,border:`3px solid ${T.border2}`,borderRadius:10,overflow:"hidden",boxShadow:`0 4px 20px rgba(0,0,0,0.25)`}}>
            {filteredH.length===0?<div style={{padding:"48px 0",textAlign:"center",color:T.textMuted}}>Nessun evento trovato</div>
            :filteredH.map((h,i)=><div key={h.id} className="rh" style={{padding:"14px 20px",borderBottom:i<filteredH.length-1?`1px solid ${T.border}`:"none",display:"flex",gap:16,alignItems:"flex-start"}}>
              <div style={{minWidth:160,paddingTop:1}}><ActionBadge action={h.action}/></div>
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:8,alignItems:"baseline",marginBottom:parseChanges(h.changes)?.length?6:0}}>
                  <span style={{fontWeight:500,fontSize:13,color:T.text}}>{h.asset_nome||"—"}</span>
                  {h.asset_serial&&<span style={{fontSize:12,color:T.link}}>{h.asset_serial}</span>}
                </div>
                {parseChanges(h.changes)?.map((c,ci)=><div key={ci} style={{fontSize:12,color:T.textSub,marginTop:3}}><span style={{color:T.textMuted}}>{c.field}: </span><span style={{color:"#ef4444"}}>{String(c.from||"(vuoto)")}</span><span style={{color:T.textMuted}}> → </span><span style={{color:"#22c55e"}}>{String(c.to||"(vuoto)")}</span></div>)}
              </div>
              <div style={{fontSize:12,color:T.textMuted,whiteSpace:"nowrap",paddingTop:2}}>{fmtTs(h.ts)}</div>
            </div>)}
          </div>
        </div>}

        {/* IMPORT */}
        {view==="import"&&<div className="ai" style={{maxWidth:820}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
            <h2 style={{fontWeight:600,fontSize:18,color:T.text}}>⬆ Importazione da Excel</h2>
          </div>
          <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:20,marginBottom:20}}>
            <div style={{fontSize:12,color:T.textSub,fontWeight:600,marginBottom:12}}>📋 Come funziona</div>
            <div style={{fontSize:13,color:T.textSub,lineHeight:1.85}}>
              1. Scarica il{" "}<button className="btn btn-ghost" onClick={dlTemplate} style={{padding:"2px 10px",fontSize:12,display:"inline-flex",verticalAlign:"middle"}}>template Excel ⬇</button>{" "}e compilalo in Excel.<br/>
              2. Le colonne <span style={{color:T.link}}>Nominativo</span> e <span style={{color:T.link}}>Seriale PC</span> sono obbligatorie.<br/>
              3. Stati validi: <span style={{color:T.text}}>Attivo · In manutenzione · Dismesso · Smarrito</span>.<br/>
              4. Salva come <b style={{color:T.text}}>.xlsx</b> e carica — vedrai un'anteprima prima di confermare.
            </div>
          </div>
          <div style={{display:"flex",gap:10,marginBottom:16}}>
            {[["aggiungi","➕ Aggiungi ai record esistenti"],["sostituisci","♻ Sostituisci tutti i record"]].map(([m,l])=>(
              <button key={m} className={`btn ${importMode===m?"btn-accent":"btn-ghost"}`} onClick={()=>setImportMode(m)}>{l}</button>
            ))}
          </div>
          {importMode==="sostituisci"&&<div style={{background:"#da363322",border:"1px solid #da363344",borderRadius:8,padding:"10px 14px",fontSize:12,color:"#f85149",marginBottom:16}}>⚠ Questa modalità eliminerà tutti i {assets.length} record esistenti.</div>}
          {!importData?(
            <div className="dz" onClick={()=>fileRef.current.click()}>
              <div style={{fontSize:40,marginBottom:12}}>📂</div>
              <div style={{fontSize:15,marginBottom:6,color:T.text}}>Clicca per selezionare il file Excel</div>
              <div style={{fontSize:12,color:T.textMuted}}>Formati supportati: <b>.xlsx</b> · .xls · .ods</div>
              <input ref={fileRef} type="file" accept=".xlsx,.xls,.ods" style={{display:"none"}} onChange={handleFile}/>
            </div>
          ):(
            <div>
              {importData.errors.length>0&&<div style={{background:"#da363322",border:"1px solid #da363344",borderRadius:8,padding:"12px 16px",marginBottom:16}}>
                <div style={{fontSize:12,color:"#f85149",marginBottom:6,fontWeight:500}}>⚠ {importData.errors.length} errore/i — righe saltate</div>
                {importData.errors.slice(0,6).map((e,i)=><div key={i} style={{fontSize:12,color:T.textSub}}>{e}</div>)}
              </div>}
              <div style={{background:T.surface,border:`3px solid ${T.border2}`,borderRadius:10,overflow:"hidden",boxShadow:`0 4px 20px rgba(0,0,0,0.25)`,marginBottom:16}}>
                <div style={{padding:"10px 16px",borderBottom:`3px solid ${T.border2}`,fontSize:12}}><span style={{color:"#22c55e",fontWeight:600}}>✓ {importData.records.length} record pronti</span></div>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                    <thead><tr style={{background:T.surface2}}>{["Nominativo","Ruolo","Seriale PC","Modello","Cellulare","Stato"].map(h=><th key={h} style={{padding:"8px 12px",textAlign:"left",color:T.textSub,fontWeight:500,fontSize:11,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
                    <tbody>
                      {importData.records.slice(0,8).map((r,i)=><tr key={i} style={{borderTop:`1px solid ${T.border2}`}}>
                        <td style={{padding:"8px 12px",color:T.text}}>{r.nominativo}</td>
                        <td style={{padding:"8px 12px"}}><span className="tag">{r.reparto||"—"}</span></td>
                        <td style={{padding:"8px 12px",color:T.link}}>{r.serialePC}</td>
                        <td style={{padding:"8px 12px",color:T.textSub}}>{r.modelloPC||"—"}</td>
                        <td style={{padding:"8px 12px",color:T.textSub}}>{r.numeroCellulare||"—"}</td>
                        <td style={{padding:"8px 12px"}}><span className="badge" style={{background:statoColor(r.stato)+"22",color:statoColor(r.stato),border:`1px solid ${statoColor(r.stato)}44`}}>{r.stato}</span></td>
                      </tr>)}
                      {importData.records.length>8&&<tr><td colSpan={6} style={{padding:"8px 12px",textAlign:"center",color:T.textMuted,fontSize:11}}>...e altri {importData.records.length-8}</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
              <div style={{display:"flex",gap:10}}>
                <button className="btn btn-ghost" onClick={()=>setImportData(null)}>← Cambia file</button>
                <button className="btn btn-primary" onClick={confirmImport} disabled={!importData.records.length}>✓ Conferma importazione ({importData.records.length})</button>
              </div>
            </div>
          )}
        </div>}

      </div>
    </div>
  );
}
